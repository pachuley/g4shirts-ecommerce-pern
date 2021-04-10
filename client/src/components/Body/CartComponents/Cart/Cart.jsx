import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearCart,
  getOrdersUser,
  incrementSizeAmount,
  decrementSizeAmount,
  deleteProductCart,
} from "../../../../redux/actions";
import styles from "./Cart.module.css";
import jwt_decode from "jwt-decode";
import Modal from "react-modal";
import Cartline from "../Cartlines/Cartline";
const { REACT_APP_API_URL } = process.env;

export default function Cart() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let [contador, setContador] = useState(0);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const token = window.localStorage.getItem("token");
  const decoded = token ? jwt_decode(token) : "";
  const cart = state.user_orders
    ? state.user_orders
    : JSON.parse(window.localStorage.getItem("cart"));
  let totalPrice = 0;
  let stockAmount = 0;

  useEffect(() => {
    if (token) {
      dispatch(getOrdersUser(decoded.id));
    }
  }, [contador]);

  const handleClearCart = () => {
    setContador(contador++);
    dispatch(clearCart(decoded.id));
    setContador(contador++);
  };

  const handleIncrementProduct = async (product) => {
    if (product.amount < 99) {
      if (!token) {
        const response = await fetch(
          `${REACT_APP_API_URL}/products/stock/${product.productId}/${product.size}`
        );
        const data = await response.json();
        if (data > product.amount) {
          dispatch(incrementSizeAmount(product));
        }
      } else {
        setContador(contador++);
        dispatch(incrementSizeAmount(product));
        setContador(contador++);
      }
    }
  };

  const handleDecrementProduct = async (product) => {
    if (product.amount > 1) {
      if (token) {
        setContador(contador++);
        dispatch(decrementSizeAmount(product));
        setContador(contador++);
      } else {
        dispatch(decrementSizeAmount(product));
      }
    }
  };
  const handleDeleteProduct = (product) => {
    setContador(contador++);
    dispatch(deleteProductCart(product));
    setContador(contador++);
  };

  return (
    <div className={`${styles.cartContainer}`}>
      <div className={`${styles.cart}`}>
        {Array.isArray(cart)
          ? cart.map((product) => (
              <div key={product.id}>
                <Cartline
                  product={product}
                  handleDecrementProduct={handleDecrementProduct}
                  handleIncrementProduct={handleIncrementProduct}
                  handleDeleteProduct={handleDeleteProduct}
                />
              </div>
            ))
          : ""}
      </div>
      <div className={`${styles.check}`}>
        <div>
          {Array.isArray(cart)
            ? cart.filter((p) => {
                totalPrice = totalPrice + parseFloat(p.price * p.amount);
                stockAmount = stockAmount + p.amount;
              })
            : ""}
        </div>
        {!cart || cart.length === 0 ? null : (
          <div>
            <div>
              <h2 className={`${styles.ticket}`}>TICKET</h2>
              <h3 className={`${styles.inWait}`}>
                En espera {stockAmount} productos
              </h3>
              <div>
                {Array.isArray(cart)
                  ? cart.map((product) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <p className={`${styles.ticketList}`}>
                          {product.name}{" "}
                        </p>
                        <p className={`${styles.ticketList}`}>
                          {parseFloat(product.price * product.amount).toFixed(
                            2
                          )}{" "}
                          USD
                        </p>
                      </div>
                    ))
                  : ""}
              </div>
              <div style={{ marginTop: 20 }}></div>
              <div className={`${styles.resumen}`}>
                <p>El total es </p>
                <p>{parseFloat(totalPrice).toFixed(2)} USD</p>
              </div>
            </div>
            <div>
              {
                decoded ? (
                  <Link to={`/checkout/${cart[0].orderId}`}>
                    <button className={`${styles.buyButton}`}>
                      CONTINUAR COMPRA <i className="fas fa-money-check"></i>
                    </button>
                  </Link>
                ) : (
                  // <Link to={`/checkoutunlogin`}>
                  //que el botón continuar compra, sea el activable para abrir un modal.
                  <div>
                    <button
                      onClick={() => setModalIsOpen(true)}
                      className={`${styles.buyButton}`}
                    >
                      CONTINUAR COMPRA <i className="fas fa-money-check"></i>
                    </button>
                    <Modal
                      className={`${styles.modalContainer}`}
                      style={{
                        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                      }}
                      isOpen={modalIsOpen}
                      onRequestClose={() => setModalIsOpen(false)}
                    >
                      <button
                        className={`${styles.closeButton}`}
                        onClick={() => setModalIsOpen(false)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      <div className={`${styles.warning}`}>
                        <i className="fas fa-exclamation-circle"></i>
                      </div>
                      <p style={{ color: "white" }}>
                        Inicia sesión o Regístrate para continuar con tu compra
                      </p>
                    </Modal>
                  </div>
                )
                // </Link>
              }
            </div>
            <div>
              <button
                className={`${styles.clearButton}`}
                onClick={handleClearCart}
              >
                VACIAR CARRITO <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
