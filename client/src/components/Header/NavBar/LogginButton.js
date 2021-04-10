import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./LogginButton.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../../redux/actions";
import RegisterButton from "./RegisterButton";
import GoogleIn from "./GoogleIn";

Modal.setAppElement("#root");

export default function LogginButton() {
  //LOGGIN
  const message = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const [login, setLogin] = useState({ email: "", password: "" });
  const [mostrar, setMostrar] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const { password, email } = login;

  //MODAL
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <div>
        <button
          onClick={() => setModalIsOpen(true)}
          className={`${styles.buttonLogin}`}
        >
          <i className="fas fa-user"></i>
        </button>

        <Modal
          className={`${styles.modalContainer}`}
          style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          <div className={`${styles.center}`}>
            <button
              className={`${styles.buttonClose}`}
              onClick={() => setModalIsOpen(false)}
            >
              <i className="fas fa-times"></i>
            </button>

            <h1>Ingresar</h1>

            <form method={"post"}>
              {/*INPUT EMAIL*/}
              <div className={`${styles.txt_field}`}>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <span></span>
                <label>Email</label>
              </div>

              {/*INPUT PASSWORD*/}

              <div className={`${styles.txt_field}`}>
                <input
                  type={mostrar ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />

                <span></span>

                <label>Contraseña</label>
              </div>

              <div className={`${styles.pass}`}>
                {" "}
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to="/password_reset"
                >
                  Olvidaste tu contraseña?
                </Link>
              </div>

              <input
                type={"submit"}
                onClick={() => {
                  dispatch(userLogin(login));
                }}
                value={"INGRESAR"}
              />

              <div className={`${styles.signup_link}`}>
                <p>Iniciar sesión con Gmail </p>

                <GoogleIn />
              </div>

              <div className={`${styles.signup_link}`}>
                No estás registrado?
                <div>
                  <RegisterButton></RegisterButton>
                </div>
              </div>

              {/*REVELAR/OCULTAR PASSWORD*/}

              <button
                className={`${styles.buttonShow}`}
                onClick={() => {
                  setMostrar(!mostrar ? true : false);
                }}
              >
                <i className="far fa-eye"></i>
              </button>
            </form>

            <div className={`${styles.confirmedLoggin}`}>
              {message &&
              message === "El email o la contraseña son incorrectos" ? (
                <p>{message}</p>
              ) : message ? (
                <p> Has iniciado sesión correctamente</p>
              ) : null}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
