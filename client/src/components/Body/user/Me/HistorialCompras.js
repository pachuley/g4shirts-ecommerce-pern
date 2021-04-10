import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersStateUserId } from "../../../../redux/actions";
import jwt from "jsonwebtoken";
import NavBarMe from "./NavBarMe";
import styles from "./HistorialCompras.module.css";
import { Link } from "react-router-dom";

const HistorialCompras = () => {
  const ordersState = useSelector((state) => state.allOrdersStateId);
  let token = window.localStorage.getItem("token");
  const user = jwt.decode(token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(getAllOrdersStateUserId("Complete", user.id));
    }
  }, []);

  if (!!ordersState && ordersState.length > 0) {
    var arr = [];
    for (let i = 0; i < ordersState.length; i++) {
      let total = 0;
      arr.push(
        <h1 className={`${styles.ordenorden}`}>
          Orden de la fecha: {ordersState[i].createdAt.slice(0, 10)}
        </h1>
      );
      ordersState[i].OrderDetails.map((elem) => {
        arr.push(
          <div className={`${styles.padre}`}>
            <div className={`${styles.centrar}`}>
              <table>
                <tr>
                  <th className={`${styles.nombreLista}`}></th>
                  <th className={`${styles.nombreLista}`}></th>
                  <th className={`${styles.nombreLista}`}></th>
                  <th className={`${styles.nombreLista}`}></th>
                </tr>

                <div className={`${styles.teDe}`}>
                  <div className={`${styles.cardHistorial}`}>
                    <Link
                      to={`/products/${elem.productId}`}
                      style={{ color: "#FFF", textDecoration: "none" }}
                    >
                      <p>{elem.name}</p>
                    </Link>
                  </div>

                  <div className={`${styles.cardHistorial}`}>
                    <p> {elem.amount} </p>
                  </div>

                  <div className={`${styles.cardHistorial}`}>
                    <p> ${elem.price} </p>
                  </div>
                </div>
              </table>
            </div>
          </div>
        );
        total += parseFloat(elem.price);
      });
      arr.push(
        <h3 className={`${styles.total}`}>Total: ${total.toFixed(2)}</h3>
      );
    }
  }

  if (token) {
    return (
      <div className={`${styles.meContainer}`}>
        <div>
          <NavBarMe></NavBarMe>
        </div>

        {!!ordersState && ordersState.length > 0 ? (
          <div className={`${styles.padre}`}>
            <div>
              <h3 className={`${styles.titual}`}>Compras Recientes</h3>
              {arr}
            </div>
          </div>
        ) : (
          <p>No ha realizado compras aun</p>
        )}
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

export default HistorialCompras;
