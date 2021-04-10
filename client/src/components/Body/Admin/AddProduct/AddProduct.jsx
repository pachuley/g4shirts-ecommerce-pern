import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getCategories } from "./../../../../redux/actions";
import NavBarAdmin from "../NavBarAdmin";
import styles from "./AddProduct.module.css";
import jwt from "jsonwebtoken";

export default function AddProduct() {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }

  //const categories = useSelector((state) => state.categories);
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const [stock, setStock] = useState({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const [input, setInput] = useState({
    name: "",
    description: "",
    price: 0,
    categories: ""
  });

  const handleInputStockChange = function (e) {
    setStock({
      ...stock,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = function (e) {
    let urlPush = [];
    urlPush.push(e.target.value);
    if (e.target.name === "categories") {
      setInput({
        ...input,
        [e.target.name]: Array.from(e.target.selectedOptions, item => item.value), 
      });
    } else {
      setInput({
        ...input,
        [e.target.name]: e.target.value,
      });
    };
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    
    let imagesfile = document.querySelector('#imagesProduct');
        
    dispatch(createProduct(input, stock, imagesfile));    

    setInput({
      name: "",
      description: "",
      price: 0,
      categories: "",
    });
    setStock({
      XS: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
    });
  };
  if (token && User.role == "admin") {
    return (
      <div>
        <NavBarAdmin></NavBarAdmin>

        <form className={`${styles.formReg}`} onSubmit={handleSubmit}>
          <h1>Crear un producto</h1>

          <div className={`${styles.contenedorInputs}`}>
            <input
              placeholder={"Nombre"}
              type="text"
              name="name"
              value={input.name}
              onChange={handleInputChange}
            />

            <input
              placeholder={"Descripción"}
              type="text"
              name="description"
              value={input.description}
              onChange={handleInputChange}
            />

            {/* <input
              placeholder={"Imagen"}
              type="text"
              name="photos"
              value={input.photos}
              onChange={handleInputChange}
            /> */}

            {state.categories ?
              <select name="categories" id="categories" 
                value={input.categories}  
                onChange={handleInputChange}
                multiple
              >
                {state.categories.map(category => <option key={category.id} value={category.id}>{category.name}</option> )}
              </select>
              : '<></>'
            }

            <input
              type="file"
              name="imagesProduct"
              id="imagesProduct"
              accept="image/png, .jpeg, .jpg, image/gif"
              multiple
            />  

            <div className={`${styles.contenedorInputs2}`}>
              <div>
                <label>Precio</label>

                <input
                  placeholder={"Precio"}
                  type="text"
                  name="price"
                  value={input.price}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label>Talle XS</label>

                <input
                  type="text"
                  name="XS"
                  value={stock.XS}
                  onChange={handleInputStockChange}
                />
              </div>

              <div>
                <label>Talle S</label>

                <input
                  type="text"
                  name="S"
                  value={stock.S}
                  onChange={handleInputStockChange}
                />
              </div>

              <div>
                <label>Talle M</label>

                <input
                  type="text"
                  name="M"
                  value={stock.M}
                  onChange={handleInputStockChange}
                />
              </div>
              <div>
                <label>Talle L</label>

                <input
                  type="text"
                  name="L"
                  value={stock.L}
                  onChange={handleInputStockChange}
                />
              </div>

              <div>
                <label>Talle XL</label>

                <input
                  type="text"
                  name="XL"
                  value={stock.XL}
                  onChange={handleInputStockChange}
                />
              </div>

              <div>
                <label>Talle XXL</label>

                <input
                  type="text"
                  name="XXL"
                  value={stock.XXL}
                  onChange={handleInputStockChange}
                />
              </div>
            </div>
            <div className={`${styles.buttonContainer}`}>
              <button
                className={`${styles.submitButton}`}
                type="submit"
                value="Agregar Producto"
                disabled={
                  !input.name || !input.description || !input.price || false
                }
              >
                {" "}
                Crear Producto
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}

{
  /* <div>
          <label>Categories: </label>
          <select
            name="categoryId"
            value={input.categoryId}
            onChange={handleInputChange}
          >
            <option value="">Select Category...</option>
            {categories &&
              categories.map((c, i) => (
                <option value={c.id} key={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div> */
}
