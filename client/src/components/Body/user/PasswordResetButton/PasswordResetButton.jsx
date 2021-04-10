import React, { useState } from "react";
import { passwordEmailReset } from "../../../../redux/actions";
import { useDispatch } from "react-redux";

export default function PasswordResetButton() {

    const [userEmail, setUserEmail] = useState("");

    const dispatch = useDispatch();
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  
    const handleChange = (e) => {
      setUserEmail(e.target.value);
    };

    const handlePasswordReset = (e) => {
      dispatch(passwordEmailReset(userEmail));
    };

    return (
        <div>
            <form>
                <p>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={handleChange}
                  />
                </p>
                {userEmail && !emailRegex.test(userEmail) ? (
                  <div>
                    <p>
                      El email debe tener formato de email ejemplo:
                      user@mail.com
                    </p>
                  </div>
                ) : null}
                {userEmail &&
                emailRegex.test(userEmail) ? (
                <p>
                    <button
                    style={{
                        borderBottom: "none",
                        background: "#ff7b06",
                        padding: 10,
                        marginTop: 19,
                    }}
                    onClick={handlePasswordReset}
                    >
                    Reestablecer Contraseña
                    </button>
                </p>
                ) : (
                <p style={{ marginTop: "1rem", marginBottom: "4rem" }}>
                    Todos los campos son obligatorios
                </p>
                )}
            </form>
        </div>
    )
}