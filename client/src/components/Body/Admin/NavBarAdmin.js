import React from "react";
import {Link} from "react-router-dom";
import styles from './NavBarAdmin.module.css'

export default function NavBarAdmin() {


    return (
        <div className={`${styles.uListContainer}`}>

            <ul className={`${styles.uList}`}>

                <li>
                    <Link className={`${styles.leenk}`} to="/admin/products">
                        Crear Producto
                    </Link>

                </li>
                <li>
                    <Link className={`${styles.leenk}`} to="/admin/categories">
                        Panel de Categorías
                    </Link>

                </li>
                <li>
                    <Link className={`${styles.leenk}`} to="/admin/users">
                        Panel de Usuario
                    </Link>

                </li>
                <li>
                    <Link className={`${styles.leenk}`} to="/admin/orders">
                        Panel de Órdenes
                    </Link>
                </li>

            </ul>
        </div>
    );
}
