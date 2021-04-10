import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { addCategory } from "./../../../../redux/actions.js";
import jwt from "jsonwebtoken";

export default function AddCategory() {
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  const [input, setInput] = useState({
    name: "",
    description: "",
  });

  const history = useHistory();
  const dispatch = useDispatch();

  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = function (e) {
    e.preventDefault();
    dispatch(addCategory(input));
    setInput({
      name: "",
      description: "",
    });
    history.push("/admin/categories");
    window.location.reload();
  };

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
            <label>Descripción: </label>
            <input
              type="text"
              name="description"
              value={input.description}
              onChange={handleInputChange}
            />
          </div>
          <input
            type="submit"
            value="Agregar Categoria"
            disabled={!input.name || !input.description || false}
          ></input>
        </form>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
