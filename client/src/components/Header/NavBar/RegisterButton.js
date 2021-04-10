import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../../redux/actions";
import styles from "./RegisterButton.module.css";

Modal.setAppElement("#root");

export default function RegisterButton() {
  //REGISTER

  const dispatch = useDispatch();

  const succesfull = useSelector((state) => state.register);
  let localCart = JSON.parse(window.localStorage.getItem("cart"));
  const [register, setRegister] = useState({
    name: "",
    surname: "",
    birthday: 0,
    email: "",
    password: "",
    country: "",
    state: "",
    city: "",
    postalcode: "",
    street: "",
    number: "",
    cart: localCart ? localCart : [],
  });
  const [confirmar, setConfirmar] = useState({ email2: "", password2: "" });

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,16}$/;

  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);
  const [pag1, setPag1] = useState(true);
  const [pag2, setPag2] = useState(false);
  const [pag3, setPag3] = useState(false);

  const handleChange1 = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
  };

  const handleChange2 = (e) => {
    setConfirmar({ ...confirmar, [e.target.name]: e.target.value });
  };

  const handleNextPage1 = (e) => {
    setPag1(false);
    setPag2(true);
    setPag3(false);
  };

  const handleNextPage2 = (e) => {
    setPag1(false);
    setPag2(false);
    setPag3(true);
  };

  const handlePrevPage1 = (e) => {
    setPag1(true);
    setPag2(false);
    setPag3(false);
  };

  const handlePrevPage2 = (e) => {
    setPag1(false);
    setPag2(true);
    setPag3(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userRegister(register));
    setRegister({
      name: "",
      surname: "",
      birthday: 0,
      email: "",
      password: "",
      country: "",
      state: "",
      city: "",
      postalcode: "",
      street: "",
      number: "",
      cart: "",
    });
    setConfirmar({
      email2: "",
      password2: "",
    });
    setPag1(true);
    setPag2(false);
    setPag3(false);
  };

  const {
    name,
    surname,
    birthday,
    email,
    password,
    country,
    state,
    city,
    postalcode,
    street,
    number,
  } = register;
  const { email2, password2 } = confirmar;

  //MODAL
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setModalIsOpen(true)}
        className={`${styles.buttonRegister}`}
      >
        Regístrate
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
          <div className={`${styles.contactWrapper}`}>
            <div className={`${styles.contactForm}`}>
              <h3>Regístrate</h3>
              <form className={`${styles.pag1}`}>
                {pag1 === true && (
                  <div>
                    <h4>Datos de Login</h4>
                    <p>
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange1}
                      />
                    </p>
                    {email && !emailRegex.test(email) ? (
                      <div className={`${styles.messageMail}`}>
                        <p>
                          El email debe tener formato de email ejemplo:
                          user@mail.com
                        </p>
                      </div>
                    ) : null}
                    <p>
                      <label htmlFor="email2">Confirmar email</label>
                      <input
                        type="text"
                        id="email2"
                        name="email2"
                        value={email2}
                        onChange={handleChange2}
                      />
                    </p>
                    {email && email2 ? (
                      email !== email2 ? (
                        <div className={`${styles.messageMail2}`}>
                          <p>Los emails no coinciden</p>
                        </div>
                      ) : null
                    ) : null}
                    <div className={`${styles.passwordContainer1}`}>
                      <div className={`${styles.password1}`}>
                        <label
                          htmlFor="password"
                          style={{ marginRight: "1rem" }}
                        >
                          Contraseña
                        </label>
                      </div>
                      <input
                        type={mostrar ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange1}
                      />
                      <button
                        style={{ background: "none", width: 5 }}
                        className={`${styles.buttonShow}`}
                        type="button"
                        onClick={() => {
                          setMostrar(!mostrar ? true : false);
                        }}
                        value="Mostrar"
                      >
                        {" "}
                        <i className="far fa-eye"></i>{" "}
                      </button>
                    </div>
                    {password && !passwordRegex.test(password) ? (
                      <div className={`${styles.messagePassword}`}>
                        {" "}
                        <p>
                          La contraseña debe tener de 8 a 15 caracteres ,<br />{" "}
                          al menos una letra mayuscula y una minuscula,
                          <br /> al menos un numero, y no espacios en blanco
                        </p>
                      </div>
                    ) : null}
                    <div className={`${styles.passwordContainer2}`}>
                      <div className={`${styles.password2}`}>
                        <label
                          htmlFor="password2"
                          style={{ marginRight: "1rem" }}
                        >
                          Confirmar contraseña
                        </label>
                      </div>
                      <input
                        type={mostrar2 ? "text" : "password"}
                        id="password2"
                        name="password2"
                        value={password2}
                        onChange={handleChange2}
                      />
                      <button
                        className={`${styles.buttonShow2}`}
                        style={{ background: "none", width: 5 }}
                        type="button"
                        onClick={() => {
                          setMostrar2(!mostrar2 ? true : false);
                        }}
                        value="Mostrar"
                      >
                        <i className="far fa-eye"></i>{" "}
                      </button>
                    </div>
                    {password2 && password ? (
                      password !== password2 ? (
                        <div className={`${styles.messagePassword2}`}>
                          <p>Las contraseñas no coinciden</p>
                        </div>
                      ) : null
                    ) : null}
                    <div className={`${styles.buttonContainer}`}>
                      <button
                        style={{
                          borderBottom: "none",
                          background: "#ff7b06",
                          padding: 10,
                          marginTop: 19,
                        }}
                        onClick={handleNextPage1}
                        className={`${styles.next}`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
                {pag2 === true && (
                  <div className={`${styles.pag2}`}>
                    <h4>Datos Personales</h4>
                    <p>
                      <label htmlFor="name">Nombre</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        name="name"
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label htmlFor="surname"> Apellido </label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={surname}
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label htmlFor="birthday">Nacimiento</label>
                      <div className={`${styles.birthDateContainer}`}>
                        <input
                          style={{ borderBottom: "none" }}
                          type="date"
                          id="birthday"
                          name="birthday"
                          value={birthday}
                          onChange={handleChange1}
                        />
                      </div>
                    </p>
                    <p>
                      <label htmlFor="country" style={{ marginRight: "1rem" }}>
                        Pais
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        onChange={handleChange1}
                      />
                    </p>
                    <div className={`${styles.buttonContainer2}`}>
                      <button
                        style={{
                          borderBottom: "none",
                          background: "#ff7b06",
                          padding: 10,
                          marginTop: 19,
                        }}
                        onClick={handlePrevPage1}
                        className={`${styles.back}`}
                      >
                        Vuelve
                      </button>
                      <button
                        style={{
                          borderBottom: "none",
                          background: "#ff7b06",
                          padding: 10,
                          marginTop: 19,
                        }}
                        onClick={handleNextPage2}
                        className={`${styles.next}`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
                {pag3 === true && (
                  <div className={`${styles.pag3}`}>
                    <h4>Dirección de Envío</h4>
                    <p>
                      <label htmlFor="street" style={{ marginRight: "1rem" }}>
                        Calle
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={street}
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label htmlFor="number" style={{ marginRight: "1rem" }}>
                        Numero
                      </label>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        value={number}
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label
                        htmlFor="postalcode"
                        style={{ marginRight: "1rem" }}
                      >
                        Codigo Postal
                      </label>
                      <input
                        type="text"
                        id="postalcode"
                        name="postalcode"
                        value={postalcode}
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label htmlFor="city" style={{ marginRight: "1rem" }}>
                        Ciudad
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={city}
                        onChange={handleChange1}
                      />
                    </p>
                    <p>
                      <label htmlFor="state" style={{ marginRight: "1rem" }}>
                        Provincia
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={state}
                        onChange={handleChange1}
                      />
                    </p>
                    <div className={`${styles.buttonContainer2}`}>
                      <button
                        style={{
                          borderBottom: "none",
                          background: "#ff7b06",
                          padding: 10,
                          marginTop: 19,
                        }}
                        onClick={handlePrevPage2}
                        className={`${styles.back}`}
                      >
                        Vuelve
                      </button>
                      <button
                        style={{
                          borderBottom: "none",
                          background: "#ff7b06",
                          padding: 10,
                          marginTop: 19,
                        }}
                        onClick={handleSubmit}
                        className={`${styles.register}`}
                      >
                        REGÍSTRATE
                      </button>
                    </div>
                  </div>
                )}
                {name &&
                surname &&
                birthday &&
                email &&
                email2 &&
                email === email2 &&
                password &&
                password2 &&
                password === password2 &&
                country &&
                state &&
                city &&
                postalcode &&
                street &&
                number &&
                emailRegex.test(email) &&
                passwordRegex.test(password) ? (
                  <p>
                    <button
                      style={{
                        borderBottom: "none",
                        background: "#ff7b06",
                        padding: 10,
                        marginTop: 19,
                      }}
                      onClick={handleSubmit}
                      className={`${styles.register}`}
                    >
                      REGÍSTRATE
                    </button>
                  </p>
                ) : (
                  <p style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
                    Todos los campos son obligatorios
                  </p>
                )}
              </form>
            </div>
          </div>
          {succesfull ? (
            <p style={{ marginTop: "1rem", marginBottom: "4rem" }}>
              {succesfull}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
