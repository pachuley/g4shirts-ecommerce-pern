import React, { useState } from "react";
import { editCategory } from "../../../../redux/actions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import NavBarAdmin from "../NavBarAdmin";
import styles from "./EditCategory.module.css";
import jwt from "jsonwebtoken";

export default function EditCategory({ match }) {
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  const { id } = match.params;
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
    dispatch(editCategory(id, input));
    setInput({
      name: "",
      description: "",
    });
    history.push("/admin/categories");
  };

  if (token && User.role == "admin") {
    return (
      <div className={`${styles.center}`}>
        <div className={`${styles.formIn}`}>
          <form onSubmit={handleSubmit}>
            <div>
              <div>
                <label>Nombre </label>

                <div className={`${styles.divisor}`}></div>
              </div>
              <input
                type="text"
                name="name"
                value={input.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <div>
                <label>Descripcion </label>
              </div>

              <div className={`${styles.divisor}`}></div>

              <input
                type="text"
                name="description"
                value={input.description}
                onChange={handleInputChange}
              />
            </div>
            <button
              className={`${styles.hola}`}
              type="submit"
              value="Guardar cambios"
              disabled={!input.name || !input.description || false}
            >
              {" "}
              GUARDAR CAMBIOS
            </button>
          </form>
        </div>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
