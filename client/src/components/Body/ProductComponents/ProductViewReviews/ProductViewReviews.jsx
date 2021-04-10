import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./ProductViewReviews.module.css";

Modal.setAppElement("#root");

export default function ProductViewReviews({ reviews, productID }) {
  //TODO: Validar que este logueado, sino no se create. UserId traido del token. Validar que sea su primera review en el producto sino no se muestra create
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  return (
    <div style={{ display: "flex" }}>
      <button
        className={`${styles.cartButton}`}
        onClick={() => setmodalIsOpen(true)}
      >
        VER REVIEWS
      </button>
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
        <table>
          <thead>
            <tr className={`${styles.table}`}>
              <th className={styles.itemTable}>Nombre</th>
              <th className={styles.itemTable}>Puntaje</th>
              <th className={styles.itemTable}>Reseña</th>
              <th className={styles.itemTable}>Description</th>
            </tr>
          </thead>
          <tbody>
            <div className={styles.divisor}></div>
            {reviews
              ? reviews.map((review) => (
                  <tr>
                    <td className={`${styles.product}`}>
                      {" "}
                      {review.user.name + " " + review.user.surname}
                    </td>

                    <td
                      className={`${styles.product}`}
                      style={{ textAlign: "center" }}
                    >
                      {" "}
                      {Array.apply(null, {
                        length: review.stars,
                      }).map(() => (
                        <span>
                          <i className="fas fa-star"></i>
                        </span>
                      ))}
                    </td>
                    <td className={`${styles.product}`}>{review.title}</td>
                    <td className={`${styles.product}`}>
                      {review.description}
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
        </table>
      </Modal>
    </div>
  );
}
