import React from "react";
import { GoogleLogin } from "react-google-login";
//import { useDispatch } from "react-redux";
//import { USER_DATA, USER_LOGIN } from "./../../../redux/constants";
const { REACT_APP_API_URL, REACT_APP_GOOGLE_CLIENT } = process.env;

const GoogleIn = () => {
  const URL = `${REACT_APP_API_URL}/auth/google`;

  const LoginSuccess = (response) => {
    var id_token = response.tokenObj.id_token;
    //const token = JSON.parse(window.localStorage.getItem("token"));
    const cart = JSON.parse(window.localStorage.getItem("cart"));
    const data = { id_token, cart };

    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (cart) window.localStorage.removeItem("cart");
        window.localStorage.setItem("token", data.token);
        window.location.reload();
      })
      .catch(console.log);
  };
  const LoginFailure = (response) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId={REACT_APP_GOOGLE_CLIENT}
      buttonText=""
      onSuccess={LoginSuccess}
      onFailure={LoginFailure}
      isSignedIn={true}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleIn;
