import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  allOrderFilterByState,
  sendPackageEmail,
} from "../../../../redux/actions";
import DetailsButton from "./DetailsButton";
import ModalChangeState from "./ModalChangeState";

import styles from "./OrdersPanel.module.css";
import NavBarAdmin from "../NavBarAdmin";
import jwt from "jsonwebtoken";

export default function UsersPanel() {
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  const [input, setInput] = useState({
    typeOrder: "",
  });
  let [counter, setCounter] = useState(0);

  let ordersFilters = useSelector((state) => state.ordersFilters);
  const dispatch = useDispatch();

  let filteredOrders =
    ordersFilters &&
    ordersFilters.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0));

  useEffect(() => {
    dispatch(allOrderFilterByState("All"));
  }, [counter]);

  const handleChangeInputFilterOrders = (e) => {
    setInput({
      input,
      typeOrder: e.target.value,
    });
  };

  const handleChangeFilterOrders = (e) => {
    dispatch(allOrderFilterByState(input.typeOrder));
  };

  const sendPackage = (user, orderId) => {
    setCounter(counter++);
    dispatch(sendPackageEmail(user, orderId));
    setCounter(counter++);
  };
  if (token && User.role == "admin") {
    return (
      <div>
        <NavBarAdmin></NavBarAdmin>

        <div className={`${styles.center2}`}>
          <div>
            FiltroOrden{" "}
            <select
              className={`${styles.seleccionador}`}
              onClick={handleChangeFilterOrders}
              onChange={handleChangeInputFilterOrders}
            >
              <option value="All">Todas</option>
              <option value="Active">Activa</option>
              <option value="Pending">Pendiente</option>
              <option value="Canceled">Cancelada</option>
              <option value="Complete">Completa</option>
            </select>
          </div>

          <table>
            <thead>
              <tr className={`${styles.table}`}>
                <th>Usuario</th>
                <th>Orden</th>
                <th>Status</th>
                <th></th>
                <th>Fecha</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {ordersFilters &&
                ordersFilters.length > 0 &&
                ordersFilters.map((order) => (
                  <tr key={order.id}>
                    <td
                      style={{ textAlign: "left" }}
                      className={`${styles.product}`}
                    >
                      {order.user.email}
                    </td>
                    <td className={`${styles.product}`}>{order.id}</td>
                    <td className={`${styles.product}`}>{order.state}</td>
                    <td>
                      <ModalChangeState match={order} />
                    </td>
                    <td className={`${styles.product}`}>
                      {order.createdAt.slice(0, -14)}
                    </td>
                    <td className={`${styles.product}`}>
                      <DetailsButton match={order} />
                    </td>
                    <td>
                      {order.state === "Pending" ? (
                        <button
                          style={{
                          border:"none", backgroundColor: "#3c3c3c", color: "white", fontFamily:"Poppins", padding: 10, borderRadius: 5, cursor:"pointer", outline:"none",
                          }}
                          onClick={() => sendPackage(order.user, order.id)}
                        >
                          Hacer el envío
                        </button>
                      ) : (
                        ""
                      )}
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
