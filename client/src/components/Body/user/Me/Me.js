import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrdersUser, getUserDetails } from "../../../../redux/actions";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import styles from "./Me.module.css";
import NavBarMe from "./NavBarMe";

const Me = () => {
  const dispatch = useDispatch();

  let token = window.localStorage.getItem("token");
  const user = jwt.decode(token);
  const orders = useSelector((state) => state.user_orders);
  const usuario = useSelector((state) => state.userDetails);

  useEffect(() => {
    if (user) {
      dispatch(getOrdersUser(user.id));
      dispatch(getUserDetails(user.id));
    }
  }, []);

  if (orders) {
    var total = 0;
    for (var i = 0; i < orders.length; i++) {
      total += parseFloat(orders[i].price);
    }
  }

  if (token) {
    return (
      <div className={`${styles.meContainer}`}>
        <div className={`${styles.navbar}`}>
          <NavBarMe></NavBarMe>
        </div>

        <div className={`${styles.titleContainer}`}>
          <div>
            <h1 className={`${styles.categoria}`}> Mi Cuenta</h1>
          </div>
          <div>
            <h1 className={`${styles.nombre}`}>
              Hola {!!usuario ? usuario.name : user.name}
            </h1>
          </div>
        </div>

        <div className={`${styles.cartCart}`}>
          <div>
            <table>
              <tbody>
                <tr className={`${styles.table}`}>
                  <th>Producto</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Talle</th>
                </tr>
                {orders &&
                  orders.map((product) => (
                    <tr key={product.id} style={{ color: "white" }}>
                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        <img src={product.url} alt="Remera" width="150px" />
                      </td>
                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        {product.name}
                      </td>
                      <td className={`${styles.product}`}>
                        {parseFloat(product.price * product.amount).toFixed(2)}{" "}
                        USD
                      </td>

                      <td className={`${styles.product}`}>{product.size}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div>
              {!!orders && orders.length > 0 ? (
                <div>
                  <Link to="/cart">
                    <button className={`${styles.buttonCart}`}>
                      IR AL CARRITO
                    </button>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Inicia Sesion para acceder al detalle de tu cuenta en G4 Shirts</h1>
      </div>
    );
  }
};

export default Me;
