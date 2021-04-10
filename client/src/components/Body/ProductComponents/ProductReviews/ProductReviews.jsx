import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProductReview } from "../../../../redux/actions";
import Modal from "react-modal";
import styles from "./ProductReviews.module.css";
import jwt from "jsonwebtoken";
import swal from "sweetalert";

Modal.setAppElement("#root");

export default function ProductReviews({ reviews, productID }) {
  //TODO: Validar que este logueado, sino no se create. UserId traido del token. Validar que sea su primera review en el producto sino no se muestra create
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  let token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  } else {
    var User = "";
  }
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    title: "",
    description: "",
    stars: 5,
    productId: productID,
    userId: User.id,
  });
  const handleInputChange = function (e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const mostrarAlerta = () => {
    swal({
      text: "Calificacion agregada",
      buttons: "Aceptar",
      icon: "success",
    }).then((respuesta) => {
      window.location.replace("/");
    });
  };

  const handleCreateReview = function (e) {
    dispatch(createProductReview(input));
    setInput({
      title: "",
      description: "",
      stars: 5,
      productId: productID,
      userId: User.id,
    });
    mostrarAlerta();
  };
  return (
    <div>
      <div className={styles.buttonContainer}>
        {!token || User.role === "admin" ? (
          <span></span>
        ) : (
          <button
            className={styles.addReviewButton}
            onClick={() => setmodalIsOpen(true)}
          >
            AGREGAR RESEÑA
          </button>
        )}
      </div>
      <Modal
        className={styles.modal}
        style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
      >
        <button
          className={styles.closeButton}
          onClick={() => setmodalIsOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className={styles.contContainer}>
          <h1>Agregar una reseña</h1>

          <div className={styles.campos}>
            <select name="stars" onChange={handleInputChange}>
              {" "}
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>

            <input
              style={{ paddingLeft: 20 }}
              placeholder={"Qué te pareció el producto?"}
              type="text"
              name="title"
              value={input.title}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.campos2}>
            <textarea
              placeholder={"Algo más que quieras contarnos?"}
              name="description"
              value={input.description}
              onChange={handleInputChange}
              cols="25"
              rows="5"
            ></textarea>
          </div>
          <button className={styles.sendButton} onClick={handleCreateReview}>
            ENVIAR RESEÑA
          </button>
        </div>
      </Modal>
      <Modal
        className={styles.modal}
        style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
      >
        <button
          className={styles.closeButton}
          onClick={() => setmodalIsOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
        <div className={styles.contContainer}>
          <h1>Agregar una reseña</h1>

          <div className={styles.campos}>
            <select name="stars" onChange={handleInputChange}>
              {" "}
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>

            <input
              style={{ paddingLeft: 20 }}
              placeholder={"Qué te pareció el producto?"}
              type="text"
              name="title"
              value={input.title}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.campos2}>
            <textarea
              placeholder={"Algo más que quieras contarnos?"}
              name="description"
              value={input.description}
              onChange={handleInputChange}
              cols="25"
              rows="5"
            ></textarea>
          </div>
          <button className={styles.sendButton} onClick={handleCreateReview}>
            ENVIAR RESEÑA
          </button>
        </div>
      </Modal>
    </div>
  );
}
