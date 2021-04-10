import React from "react";
import banner from "../images/banner.png";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import { useDispatch } from "react-redux";
import { getProducts } from "../../redux/actions";
import styles from "./Header.module.css";

export default function Header() {
  const dispatch = useDispatch();

  return (
    <div className={`${styles.headerContainer}`}>
      <div className={`${styles.photoTitle}`}>
        <img src={banner} alt="" style={{ height: 90 }} className={`${styles.img}`}/>
        <Link
          className={`${styles.title}`}
          onClick={() => {
            dispatch(getProducts());
          }}
          to="/"
        >
          <div className={`${styles.bar}`}>
            <img src={logo} alt="" style={{ height: 90 }} />
            <h2 className={`${styles.shirts}`}>Shirts</h2>
          </div>
        </Link>
      </div>
      <NavBar />
    </div>
  );
}
