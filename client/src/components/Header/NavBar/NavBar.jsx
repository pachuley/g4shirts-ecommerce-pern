import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  getProducts,
  getProductsByCategory,
  userLogout,
  getOrdersUser,
} from "../../../redux/actions";
import Categories from "../Categories/Categories";
import LogginButton from "./LogginButton";
import styles from "./NavBar.module.css";
import jwt_decode from "jwt-decode";
import GoogleOut from "./GoogleOut";

export default function NavBar() {
  const state = useSelector((state) => state);
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();
  const token = window.localStorage.getItem("token");
  const User = token ? jwt_decode(token) : "";

  const handleChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  const handleSubmit = (e) => {
    dispatch(getProducts(search));
    history.push("/");
  };

  useEffect(() => {
    if (window.location.pathname === "/product-category") {
      dispatch(getProductsByCategory(state.activeCategory, search));
    } else if (window.location.pathname === "/") {
      dispatch(getProducts(search));
    }
  }, [search]);

  useEffect(() => {
    if (token && window.location.pathname === "/") {
      dispatch(getOrdersUser(User.id));
    }
  }, [dispatch]);

  const handleLogOut = (e) => {
    dispatch(userLogout());
    history.push("/");
    window.location.reload(true);
  };

  return (
    <div className={`${styles.buttonsContainer}`}>
      <div className={`${styles.categoriesContainer}`}>
        <Categories />
      </div>
      <div className={`${styles.list}`}>
        {window.location.pathname === "/" ||
        window.location.pathname === "/product-category" ? (
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              className={`${styles.searchBar}`}
              style={{ fontFamily: "poppins" }}
              value={search}
              onChange={(e) => handleChange(e)}
              placeholder={"Búsqueda"}
            />{" "}
          </form>
        ) : (
          ""
        )}{" "}
        {!token ? (
          <div className={`${styles.loggedOutList}`}>
            <Link to="/cart" className={`${styles.listItem}`}>
              <i className="fas fa-shopping-cart"></i>
              {localStorage.cart &&
                JSON.parse(localStorage.cart).length !== 0 && (
                  <label className={styles.cartNumber}>
                    {JSON.parse(localStorage.cart).length}
                  </label>
                )}
            </Link>
            <Link className={`${styles.listItem}`}>
              <LogginButton></LogginButton>
            </Link>
          </div>
        ) : (
          <div className={`${styles.loggedInList}`}>
            {User && User.role === "admin" ? (
              <div>
                <Link to="/admin" className={`${styles.listItem}`}>
                  <i className="fas fa-users-cog"></i>
                </Link>

                {User.google ? (
                  <GoogleOut />
                ) : (
                  <button
                    className={`${styles.logOutButton} ${styles.listItem}`}
                    onClick={handleLogOut}
                  >
                    <i className="fas fa-sign-in-alt fa-2x"></i>
                  </button>
                )}

                <span className={`${styles.greeting}`}>Hola, {User.name}</span>
              </div>
            ) : (
              <div className={`${styles.loggedInList}`}>
                <Link
                  title={"Mi Perfil"}
                  to="/me"
                  className={`${styles.listItem}`}
                >
                  <i className="fas fa-user-circle"></i>
                </Link>
                <Link
                  title={"Mi Carrito"}
                  to="/cart"
                  className={`${styles.listItem}`}
                >
                  <i className="fas fa-shopping-cart"></i>
                  {state.user_orders && state.user_orders.length !== 0 && (
                    <label className={styles.cartNumber}>
                      {state.user_orders.length}
                    </label>
                  )}
                </Link>

                {User && User.google ? (
                  <GoogleOut />
                ) : (
                  <button
                    className={`${styles.logOutButton} ${styles.listItem}`}
                    onClick={handleLogOut}
                  >
                    <i className="fas fa-sign-in-alt fa-2x"></i>
                  </button>
                )}

                <span className={`${styles.greeting}`}>Hola, {User.name}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
