import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCategories,
  addCategoryToProduct,
} from "./../../../../redux/actions";
import jwt from "jsonwebtoken";

export default function JoinActivity() {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  const products = useSelector((state) => state.products);
  const categories = useSelector((state) => state.categories);
  const [input, setInput] = useState({
    product: "",
    category: "",
  });
  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCategoryToProduct(input.product, input.category));
    setInput({
      product: "",
      category: "",
    });
  };
  if (token && User.role == "admin") {
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Products: </label>
          <select
            name="product"
            value={input.product}
            onChange={handleInputChange}
          >
            <option value="">Select Product...</option>
            {products &&
              products.map((p, i) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
        <div className="div">
          <label>Categories: </label>
          <select
            name="category"
            value={input.category}
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
        </div>
        <input type="submit" value="Asociar"></input>
      </form>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
