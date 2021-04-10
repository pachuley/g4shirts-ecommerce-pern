import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  //addCategoryToProduct,
  getCategoriesByProduct,
  //deleteProductCategory,
  editProduct,
} from "./../../../../redux/actions";
import jwt from "jsonwebtoken";

export default function EditProduct({ match }) {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  //const categories = useSelector((state) => state.categories);
  let nameCategoriesByProduct = useSelector(
    (state) => state.nameCategoriesByProduct
  );
  useEffect(() => {
    dispatch(getCategories());
    getCategoriesByProduct(match.params.id);
  }, [dispatch, nameCategoriesByProduct, match.params.id]);

  const [input, setInput] = useState({
    name: "",
    description: "",
    price: 0,
    url: "",
    categoryId: 0,
  });

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    dispatch(editProduct(match.params.id, input));
    setInput({
      name: "",
      description: "",
      price: 0,
      url: "",
      categoryId: 0,
    });
  };

  // const handleAddCategory = (e) => {
  //   e.preventDefault();
  //   dispatch(addCategoryToProduct(match.params.id, input.categoryId));
  //   dispatch(getCategoriesByProduct(match.params.id));
  // };

  // const handleRemoveCategory = (e) => {
  //   e.preventDefault();
  //   dispatch(deleteProductCategory(match.params.id, e.target.value));
  // };
  if (token && User.role == "admin") {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre: </label>
            <input
              type="text"
              name="name"
              value={input.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Descripcion: </label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Precio: </label>
            <input
              type="text"
              name="price"
              value={input.price}
              onChange={handleInputChange}
            />
          </div>
          {/* <div>
            <label>Talle: </label>
            <input
              type="text"
              name="size"
              value={input.size}
              onChange={handleInputChange}
            />
          </div> */}
          {/* <div>
            <label>Cantidad: </label>
            <input
              type="number"
              name="stock"
              value={input.stock}
              onChange={handleInputChange}
            />
          </div> */}
          <div>
            <label>Url: </label>
            <input
              type="text"
              name="url"
              value={input.url}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="submit"
            value="Guardar cambios"
            disabled={
              !input.name || !input.description || !input.price || false
            }
          ></input>
        </form>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
