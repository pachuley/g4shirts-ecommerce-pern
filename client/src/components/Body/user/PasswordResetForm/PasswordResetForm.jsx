import React, { useState } from "react";
import { passwordReset } from "../../../../redux/actions";
//import styles from "./LogginButton.module.css";
import { useDispatch } from "react-redux";

export default function PasswordResetForm({ match }) {
  const [input, setNewPassword] = useState({
    newPassword: "",
    password2: "",
  });
  const dispatch = useDispatch();
  const [mostrar, setMostrar] = useState(false);
  const [mostrar2, setMostrar2] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,16}$/;

  const handleChange = (e) => {
    setNewPassword({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const { newPassword, password2 } = input;

  const handlePasswordReset = (e) => {
    dispatch(passwordReset(match.params.id, newPassword));
  };

  return (
    <div>
      <form>
        <p>
          <label htmlFor="password" style={{ marginRight: "1rem" }}>
            Contraseña
          </label>
          <input
            type={mostrar ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
          />
          <button
            style={{ background: "none", width: 5 }}
            type="button"
            onClick={() => {
              setMostrar(!mostrar ? true : false);
            }}
            value="Mostrar"
          >
            {" "}
            <i className="far fa-eye"></i>{" "}
          </button>
        </p>
        {newPassword && !passwordRegex.test(newPassword) ? (
          <div>
            {" "}
            <p>
              La contraseña debe tener de 8 a 15 caracteres ,<br /> al menos una
              letra mayuscula y una minuscula,
              <br /> al menos un numero, y no espacios en blanco
            </p>
          </div>
        ) : null}
        <p>
          <label htmlFor="password2" style={{ marginRight: "1rem" }}>
            Confirmar contraseña
          </label>
          <input
            type={mostrar2 ? "text" : "password"}
            id="password2"
            name="password2"
            value={password2}
            onChange={handleChange}
          />
          <button
            style={{ background: "none", width: 5 }}
            type="button"
            onClick={() => {
              setMostrar2(!mostrar2 ? true : false);
            }}
            value="Mostrar"
          >
            <i className="far fa-eye"></i>{" "}
          </button>
        </p>
        {password2 && newPassword ? (
          newPassword !== password2 ? (
            <div>
              <p>Las contraseñas no coinciden</p>
            </div>
          ) : null
        ) : null}
        {newPassword &&
        password2 &&
        newPassword === password2 &&
        passwordRegex.test(newPassword) ? (
          <p>
            <button
              style={{
                borderBottom: "none",
                background: "#ff7b06",
                padding: 10,
                marginTop: 19,
              }}
              onClick={handlePasswordReset}
              //className={`${styles.register}`}
            >
              Cambiar Contraseñas
            </button>
          </p>
        ) : (
          <p style={{ marginTop: "1rem", marginBottom: "4rem" }}>
            Todos los campos son obligatorios
          </p>
        )}
      </form>
    </div>
  );
}
