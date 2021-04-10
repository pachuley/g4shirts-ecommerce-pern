import React, { useState, useEffect } from "react";
import {
  getUserDetails,
  userUpdate,
  passwordChange,
} from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import Modal from "react-modal";
import NavBarMe from "./NavBarMe";
import styles from "./Profile.module.css";

Modal.setAppElement("#root");

const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,16}$/;

const Profile = () => {
  const token = window.localStorage.getItem("token");
  const user = jwt.decode(token);
  const usuario = useSelector((state) => state.userDetails);
  let cambios = useSelector((state) => state.userUpdate);
  const cambiosPassword = useSelector((state) => state.passwordChange);

  const [modalIsOpen1, setModalIsOpen1] = useState(false);
  const [modalIsOpen2, setModalIsOpen2] = useState(false);
  const [modalIsOpen3, setModalIsOpen3] = useState(false);
  const [modalIsOpen4, setModalIsOpen4] = useState(false);
  //let [counter, setCounter] = useState(0);
  const [address, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    postalcode: "",
    street: "",
    number: "",
  });
  const [datos, setDatos] = useState({
    name: "",
    surname: "",
    birthday: 0,
  });

  const [email, setEmail] = useState("");

  const [mostrar, setMostrar] = useState(false);

  const [mostrar2, setMostrar2] = useState(false);

  const [contraseña, setContraseña] = useState({ password: "", password2: "" });

  const handleChange1 = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };
  const handleChange2 = (e) => {
    setEmail(e.target.value);
  };
  const handleChange3 = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleChange4 = (e) => {
    setContraseña({ ...contraseña, [e.target.name]: e.target.value });
  };
  const { country, state, city, postalcode, street, number } = address;

  const enviarCambiosAddress = () => {
    // const adress = `${calle} ${numero} ${codigoPostal} ${ciudad} ${provincia} ${pais}`;
    dispatch(
      userUpdate(user.id, {
        country,
        state,
        city,
        postalcode,
        street,
        number,
      })
    );
    window.location.reload();
  };

  const { name, surname, birthday } = datos;

  const enviarCambiosDatos = () => {
    if (!!name && !!surname && !!birthday) {
      dispatch(
        userUpdate(user.id, {
          name: name,
          surname: surname,
          birthday: birthday,
        })
      );
      window.location.reload();
    } else if (!!name && !!birthday) {
      dispatch(
        userUpdate(user.id, {
          name: name,
          birthday: birthday,
        })
      );
      window.location.reload();
    } else if (!!surname && !!birthday) {
      dispatch(
        userUpdate(user.id, {
          surname: surname,
          birthday: birthday,
        })
      );
      window.location.reload();
    } else if (!!surname && name) {
      dispatch(
        userUpdate(user.id, {
          name: name,
          surname: surname,
        })
      );
      window.location.reload();
    } else if (!!surname) {
      dispatch(
        userUpdate(user.id, {
          surname: surname,
        })
      );

      window.location.reload();
    } else if (!!name) {
      dispatch(
        userUpdate(user.id, {
          name: name,
        })
      );

      window.location.reload();
    } else if (!!birthday) {
      dispatch(
        userUpdate(user.id, {
          birthday: birthday,
        })
      );

      window.location.reload();
    }
  };

  const enviarCambiosEmail = () => {
    dispatch(
      userUpdate(user.id, {
        email: email,
      })
    );
    window.location.reload();
  };

  const { password, password2 } = contraseña;

  const enviarCambiosContraseña = () => {
    dispatch(passwordChange(usuario.id, password, password2, usuario.email));
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(getUserDetails(user.id));
    }
  }, []);

  if (token) {
    return (
      <div className={`${styles.profileContainer}`}>
        {usuario ? (
          <div>
            <div className={`${styles.navbar}`}>
              <NavBarMe></NavBarMe>
            </div>

            <ul className={`${styles.contenedorGeneral}`}>
              {/*primer item*/}
              <li className={`${styles.listItem1}`}>
                <div className={`${styles.datosContainer}`}>
                  <h2 className={`${styles.titleLi}`}>Nombre</h2>

                  <h3
                    className={`${styles.nameLi}`}
                  >{`${usuario.name}  ${usuario.surname}`}</h3>

                  <div>
                    {usuario.birthday && (
                      <div>
                        <h2 className={`${styles.titleLi}`}>
                          Fecha de nacimiento
                        </h2>

                        <h3
                          className={`${styles.birthday}`}
                        >{`${usuario.birthday}`}</h3>
                      </div>
                    )}

                    <div>
                      <button
                        className={`${styles.birthdayButton}`}
                        onClick={() => setModalIsOpen1(true)}
                      >
                        <i className="fas fa-pencil-alt"></i> EDITAR DATOS
                        PERSONALES
                      </button>
                    </div>
                  </div>
                </div>

                <Modal
                  className={`${styles.personalModal}`}
                  style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
                  isOpen={modalIsOpen1}
                  onRequestClose={() => setModalIsOpen1(false)}
                >
                  <button
                    className={`${styles.closeButton}`}
                    onClick={() => setModalIsOpen1(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h1>Edita tus datos personales</h1>
                  <div>
                    <div>
                      <label for="name">Nombre</label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange1}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label for="surname"> Apellido </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        value={surname}
                        onChange={handleChange1}
                      />
                    </div>
                  </div>
                  <div>
                    <div>
                      <label for="birthday" style={{ marginRight: "1rem" }}>
                        Birthday
                      </label>
                    </div>

                    <div>
                      <input
                        type="date"
                        id="birthday"
                        name="birthday"
                        value={birthday}
                        onChange={handleChange1}
                      />
                    </div>
                  </div>
                  {name || surname || birthday ? (
                    <button
                      className={`${styles.saveButton}`}
                      onClick={() => enviarCambiosDatos()}
                    >
                      GUARDAR
                    </button>
                  ) : null}
                  {cambios ? <p>{cambios}</p> : null}
                </Modal>
              </li>
              {/*termina primer item*/}

              {/*segundo item*/}
              <li className={`${styles.listItem2}`}>
                <h2 className={`${styles.titleLi}`}>Dirección</h2>
                {usuario.street &&
                usuario.number &&
                usuario.postalcode &&
                usuario.city &&
                usuario.state ? (
                  <div style={{ display: "flex" }}>
                    <div className={`${styles.dirContainer}`}>
                      {/*Calle y altura*/}{" "}
                      <h3 className={`${styles.titleLiDir}`}>Calle y Altura</h3>
                      <h3 className={`${styles.nameLiDir}`}>
                        {usuario.street + " " + usuario.number}{" "}
                      </h3>
                      {/*código postal*/}{" "}
                      <h3 className={`${styles.titleLiDir}`}>Código Postal</h3>
                      <h3 className={`${styles.nameLiDir}`}>
                        {usuario.postalcode}{" "}
                      </h3>
                    </div>

                    <div className={`${styles.dirContainer}`}>
                      {/*ciudad*/}{" "}
                      <h3 className={`${styles.titleLiDir}`}>Ciudad</h3>
                      <h3 className={`${styles.nameLiDir}`}>{usuario.city} </h3>
                      {/*provincia*/}
                      <h3 className={`${styles.titleLiDir}`}>Provincia</h3>
                      <h3 className={`${styles.nameLiDir}`}>
                        {usuario.state}{" "}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div>Debes ingresar tu dirección</div>
                )}

                <button
                  className={`${styles.buttonDir}`}
                  onClick={() => setModalIsOpen2(true)}
                >
                  <i className="fas fa-pencil-alt"></i>EDITAR
                </button>

                <Modal
                  className={`${styles.personalModaliz}`}
                  style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
                  isOpen={modalIsOpen2}
                  onRequestClose={() => setModalIsOpen2(false)}
                >
                  <button
                    className={`${styles.closeButton}`}
                    onClick={() => setModalIsOpen2(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>

                  <h1 className={`${styles.editDirection}`}>
                    Edita tu direccion{" "}
                  </h1>

                  <div
                    style={{ display: "flex" }}
                    className={`${styles.editor}`}
                  >
                    <div>
                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="street"
                        >
                          Calle
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="street"
                          name="street"
                          value={street}
                          onChange={handleChange3}
                        />
                      </div>

                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="number"
                        >
                          Numero
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="number"
                          name="number"
                          value={number}
                          onChange={handleChange3}
                        />
                      </div>

                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="postalcode"
                        >
                          Codigo Postal
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="postalcode"
                          name="postalcode"
                          value={postalcode}
                          onChange={handleChange3}
                        />
                      </div>
                    </div>

                    <div>
                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="city"
                        >
                          Ciudad
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={city}
                          onChange={handleChange3}
                        />
                      </div>

                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="state"
                        >
                          Provincia
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={state}
                          onChange={handleChange3}
                        />
                      </div>

                      <div>
                        <label
                          style={{ color: "white", fontWeight: "lighter" }}
                          for="country"
                        >
                          Pais
                        </label>
                      </div>

                      <div>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={country}
                          onChange={handleChange3}
                        />
                      </div>
                    </div>
                  </div>

                  {country &&
                  state &&
                  city &&
                  postalcode &&
                  street &&
                  number ? (
                    <button
                      className={`${styles.buttonSaveDir}`}
                      onClick={() => enviarCambiosAddress()}
                    >
                      GUARDAR
                    </button>
                  ) : null}
                  {cambios ? <p>{cambios}</p> : null}
                </Modal>
              </li>
              {/*    termina segundo item*/}

              {/*tercer item*/}
              <li className={`${styles.listItem3}`}>
                <h2 className={`${styles.titleLi}`}>Datos de acceso</h2>
                <h3 className={`${styles.titleLi}`}>Correo Electrónico</h3>
                <h3 className={`${styles.nameLi}`}> {usuario.email}</h3>
                <button
                  className={`${styles.passButton}`}
                  onClick={() => setModalIsOpen3(true)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-pencil-alt"></i> EDITAR
                </button>
                <Modal
                  className={`${styles.personalModal}`}
                  style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
                  isOpen={modalIsOpen3}
                  onRequestClose={() => setModalIsOpen3(false)}
                >
                  <button
                    className={`${styles.closeButton}`}
                    onClick={() => setModalIsOpen3(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h1>Edita tu correo electronico</h1>
                  <div>
                    <div>
                      <label for="email">Email</label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange2}
                      />
                    </div>
                  </div>
                  {email && !emailRegex.test(email) ? (
                    <p>
                      El email debe tener formato de email ejemplo:
                      user@mail.com
                    </p>
                  ) : null}
                  {email && emailRegex.test(email) ? (
                    <button
                      className={`${styles.saveButton}`}
                      onClick={() => enviarCambiosEmail()}
                    >
                      GUARDAR
                    </button>
                  ) : !email ? (
                    <p>Introduce un nuevo email</p>
                  ) : null}
                  {cambios ? <p>{cambios}</p> : null}
                </Modal>

                <h3 className={`${styles.titleLi}`}>Contraseña </h3>
                <h3 className={`${styles.nameLi}`}>
                  {user.google ? "Logueado con google" : "* * * * * * * *"}
                </h3>
                {!user.google ? (
                  <button
                    className={`${styles.passButton}`}
                    onClick={() => setModalIsOpen4(true)}
                  >
                    <i className="fas fa-pencil-alt"></i> EDITAR
                  </button>
                ) : null}

                <Modal
                  className={`${styles.personalModal}`}
                  style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
                  isOpen={modalIsOpen4}
                  onRequestClose={() => setModalIsOpen4(false)}
                >
                  <button
                    className={`${styles.closeButton}`}
                    onClick={() => setModalIsOpen4(false)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                  <h1>Edita tu contraseña</h1>
                  <div>
                    <div>
                      <label for="password">Contraseña nueva</label>
                    </div>

                    <div>
                      <input
                        type={mostrar ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange4}
                      />

                      <button
                        className={`${styles.eyebutton}`}
                        type="button"
                        onClick={() => {
                          setMostrar(!mostrar ? true : false);
                        }}
                      >
                        <i className="fas fa-eye"></i>{" "}
                      </button>
                    </div>
                  </div>
                  {password && !passwordRegex.test(password) ? (
                    <p>
                      La contraseña debe tener de 8 a 15 caracteres ,<br /> al
                      menos una letra mayuscula y una minuscula,
                      <br /> al menos un numero, y no espacios en blanco
                    </p>
                  ) : null}
                  <div>
                    <label for="password2">Contraseña anterior</label>
                    <input
                      type={mostrar2 ? "text" : "password"}
                      id="password2"
                      name="password2"
                      value={password2}
                      onChange={handleChange4}
                    />
                    <button
                      className={`${styles.eyebutton}`}
                      type="button"
                      onClick={() => {
                        setMostrar2(!mostrar2 ? true : false);
                      }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                  {password && password2 && passwordRegex.test(password) ? (
                    <button onClick={() => enviarCambiosContraseña()}>
                      Guardar Cambios
                    </button>
                  ) : null}
                  {cambiosPassword ? <p>{cambiosPassword}</p> : null}
                </Modal>
              </li>
              {/*    termina tercer item*/}
            </ul>
          </div>
        ) : (
          <p>cargando...</p>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <h1>Inicia Sesion para ver el detalle de tu perfil</h1>
      </div>
    );
  }
};

export default Profile;
