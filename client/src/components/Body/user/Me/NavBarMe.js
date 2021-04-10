import React from "react";
import {Link} from "react-router-dom";
import styles from "./NavBarMe.module.css"
const NavBarMe = () => {
    let token = window.localStorage.getItem("token");

    if (token) {
        return (


            <div className={`${styles.uListContainer}`}>
                <ul className={`${styles.uList}`}>
                    <li>
                        <Link className={`${styles.leenk}`} to="/me">
                            Mi cuenta
                        </Link>
                    </li>

                    <li>
                        <Link  className={`${styles.leenk}`}to="/me/profile">
                            Datos Personales
                        </Link>


                    </li>
                    <li>
                        <Link className={`${styles.leenk}`} to="/me/historial">
                            Historial de compras
                        </Link>
                    </li>
                </ul>


            </div>


        );
    } else {
        return <h1></h1>;
    }
};

export default NavBarMe;
