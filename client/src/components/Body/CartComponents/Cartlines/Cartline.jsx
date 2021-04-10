import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Cartline.module.css";

export default function Cartline({
  product,
  handleIncrementProduct,
  handleDecrementProduct,
  handleDeleteProduct,
}) {
  const dispatch = useDispatch();
  const token = window.localStorage.getItem("token");

  return (
    <div className={`${styles.cartlineContainer}`}>
      <div className={`${styles.imgTitleContainer}`}>
        <div className={`${styles.imgContainer}`}>
          <img
            src={product.url}
            className={`${styles.img} img-fluid img-thumbnail`}
            alt=""
          />
        </div>
        <div className={`${styles.titleContainer}`}>
          <h3 className={`${styles.titleCart}`}>{product.name}</h3>
          <span>Talle {product.size}</span>
        </div>
      </div>
      <div className={`${styles.buttonDetailsContainer}`}>
        <div className={`${styles.buttonContainer}`}>
          <button
            className={`${styles.button1}`}
            onClick={() => handleIncrementProduct(product)}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className={`${styles.button2}`}
            onClick={() => handleDecrementProduct(product)}
          >
            <i className="fas fa-minus"></i>
          </button>
        </div>
        <div className={`${styles.textContainer}`}>
          <span>
            Precio: USD {parseFloat(product.price * product.amount).toFixed(2)}{" "}
          </span>
          <span>Cant: {product.amount}</span>
        </div>
      </div>
      <div className={`${styles.buttonTrashContainer}`}>
        <button
          className={`${styles.button3}`}
          onClick={() => handleDeleteProduct(product)}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}
