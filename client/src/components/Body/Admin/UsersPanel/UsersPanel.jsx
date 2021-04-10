import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./UsersPanel.module.css";
import {
  getUsers,
  deleteUser,
  userPromote,
  userDegrade,
  userDelete,
} from "../../../../redux/actions";
import NavBarAdmin from "../NavBarAdmin";
import jwt from "jsonwebtoken";

export default function UsersPanel() {
  var usersAux;
  let users = useSelector((state) => state.users);
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  if (users) {
    users = users.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  /*   const handleDelete = function (id) {
    dispatch(deleteUser(id));
  }; */
  const handlePromoteUser = (e) => {
    dispatch(userPromote(e.target.value));
    usersAux = users.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
    window.location.reload(true);
  };

  const handleDegradeUser = (e) => {
    dispatch(userDegrade(e.target.value));
    usersAux = users.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
    window.location.reload(true);
  };

  const handleDeleteUser = (e) => {
    dispatch(userDelete(e.target.value));
    usersAux = users.sort((a, b) =>
      a.name > b.name ? 1 : a.name < b.name ? -1 : 0
    );
    window.location.reload(true);
  };

  if (token && User.role == "admin") {
    return (
      <div>
        <NavBarAdmin></NavBarAdmin>

        <div className={`${styles.centerenter}`}>
          <table>
            <thead>
              <tr className={`${styles.table}`}>
                <th>Id</th>
                <th>Email</th>
                <th>Nombre</th>
                <th>Apellido</th>
                {/* <th>Fecha de Nacimiento</th> */}
                {/* <th>Dirección</th> */}
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users && !usersAux
                ? users.map((user, i) => (
                    <tr key={user.id} style={{ color: "white" }}>
                      <td className={`${styles.product}`}>{user.id}</td>
                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        {user.email}
                      </td>
                      <td className={`${styles.product}`}>{user.name}</td>
                      <td className={`${styles.product}`}>{user.surname}</td>
                      {/* <td className={`${styles.product}`}>{user.birthday}</td> */}
                      {/* <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        {user.adress}
                      </td> */}
                      <td className={`${styles.product}`}>
                        {user.roleId === 1 ? "admin" : "user"}
                      </td>
                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        {user.roleId === 2 ? (
                          <button
                            className={`${styles.promoremo}`}
                            value={user.id}
                            onClick={handlePromoteUser}
                          >
                            Promover
                          </button>
                        ) : (
                          <button
                            className={`${styles.promoremo}`}
                            value={user.id}
                            onClick={handleDegradeUser}
                          >
                            Degradar
                          </button>
                        )}
                      </td>
                      {/* <td>
                    <button style={{ marginRight: "1rem", marginLeft: "1rem" }}>
                      Editar
                    </button>
                  </td> */}
                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        <button
                          className={`${styles.button3}`}
                          value={user.id}
                          onClick={handleDeleteUser}
                          style={{ marginRight: "1rem", marginLeft: "1rem" }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                : usersAux &&
                  usersAux.map((user, i) => (
                    <tr key={user.id} style={{ color: "white" }}>
                      <td>{user.id}</td>
                      <td>{user.email}</td>
                      <td>{user.name}</td>
                      <td>{user.surname}</td>
                      <td>{user.birthday}</td>
                      <td>{user.adress}</td>
                      <td>{user.roleId === 1 ? "admin" : "user"}</td>
                      <td>
                        {user.roleId === 2 ? (
                          <button
                            style={{ border: "none" }}
                            value={user.id}
                            onClick={handlePromoteUser}
                          >
                            Promover
                          </button>
                        ) : (
                          <button
                            style={{ border: "none" }}
                            value={user.id}
                            onClick={handleDegradeUser}
                          >
                            Degradar
                          </button>
                        )}
                      </td>
                      {/* <td>
                      <button style={{ marginRight: "1rem", marginLeft: "1rem" }}>
                        Editar
                      </button>
                    </td> */}
                      <td>
                        <button
                          value={user.id}
                          onClick={handleDeleteUser}
                          style={{ marginRight: "1rem", marginLeft: "1rem" }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
