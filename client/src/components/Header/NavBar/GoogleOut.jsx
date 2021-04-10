import React from "react";
import { GoogleLogout } from "react-google-login";
const { REACT_APP_GOOGLE_CLIENT } = process.env;

const GoogleOut = () => {
  const LogoutSuccess = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div>
      <GoogleLogout
        clientId={REACT_APP_GOOGLE_CLIENT}
        buttonText="Out"
        onLogoutSuccess={LogoutSuccess}
      />
    </div>
  );
};

export default GoogleOut;
