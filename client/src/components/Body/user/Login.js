import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../../redux/actions";

const Login = () => {
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);

  const [login, setLogin] = useState({ email: "", password: "" });

  const [formMandado, setFormMandado] = useState(false);

  const [mostrar, setMostrar] = useState(false);

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin(login));
    setFormMandado(true);
  };

  return (
    <div>
      <h1 style={{ marginTop: "3rem" }}>Inicia sesion en G4 Shirts</h1>
      <form
        style={{ marginTop: "5rem", display: "block" }}
        onSubmit={handleSubmit}
      >
        <div style={{ marginTop: "2rem", display: "flex" }}>
          <label for="email" style={{ marginRight: "4.2rem" }}>
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={login.email}
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: "2rem", display: "flex" }}>
          <label for="password" style={{ marginRight: "1rem" }}>
            Contraseña
          </label>
          <input
            type={mostrar ? "text" : "password"}
            id="password"
            name="password"
            value={login.password}
            onChange={handleChange}
          />
          <input
            type="button"
            onClick={() => {
              setMostrar(!mostrar ? true : false);
            }}
            value="Mostrar"
          />
        </div>
        {login.email && login.password ? (
          <input
            type="submit"
            value="Iniciar Sesion"
            style={{ marginTop: "1rem", marginBottom: "4rem" }}
          />
        ) : null}
      </form>

      {token ? (
        <p style={{marginLeft:0}}>Has iniciado sesion</p>
      ) : formMandado ? (
        <p>Email o contraseña incorrectos</p>
      ) : null}
    </div>
  );
};

export default Login;
