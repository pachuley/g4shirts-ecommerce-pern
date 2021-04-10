import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCategories, deleteCategory } from "../../../../redux/actions";
import styles from "./AdminCategoryPanel.module.css";
import NavBarAdmin from "../NavBarAdmin";
import jwt from "jsonwebtoken";

export default function AdminCategoryPanel() {
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  let categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  useEffect(() => {
    if (categories === undefined) {
      dispatch(getCategories());
    }
  }, [dispatch, categories]);

  const handleDelete = function (id) {
    dispatch(deleteCategory(id));
    window.location.reload();
  };

  if (token && User.role == "admin") {
    return (
      <div>
        <NavBarAdmin></NavBarAdmin>

        <div className={`${styles.formReg}`}>
          <table>
            <thead>
              <tr className={`${styles.table}`}>
                <th>Id</th>
                <th>Nombre</th>
                <th>Descripcion</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.map((category, i) => (
                  <tr key={category.id} style={{ color: "white" }}>
                    <td className={`${styles.product}`}>{category.id}</td>
                    <td className={`${styles.product}`}>{category.name}</td>
                    <td
                      style={{ textAlign: "left" }}
                      className={`${styles.product}`}
                    >
                      {category.description}
                    </td>

                    <td>
                      <Link to={`/admin/edit_category/${category.id}`}>
                        <button className={`${styles.button2}`}>
                          <i className="fas fa-edit"></i>
                        </button>
                      </Link>
                    </td>
                    <td>
                      <button
                        className={`${styles.button3}`}
                        onClick={() => handleDelete(category.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <Link to="/admin/add_categories">
          <button className={`${styles.categoryButton}`}>
            CREAR UNA NUEVA CATEGORÍA
          </button>
        </Link>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
