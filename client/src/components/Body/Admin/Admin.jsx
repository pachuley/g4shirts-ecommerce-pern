import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, getProducts } from "../../../redux/actions";
import styles from "./Admin.module.css";
import NavBarAdmin from "./NavBarAdmin";
import jwt from "jsonwebtoken";

export default function Admin() {
  let [contador, setContador] = useState(0);
  const dispatch = useDispatch();
  let products = useSelector((state) => state.products);
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  useEffect(() => {
    //if (products === undefined) {
    dispatch(getProducts());
    //}
  }, [contador]);

  const handleDeleteProduct = function (productId) {
    setContador(contador++);
    dispatch(deleteProduct(productId));
    setContador(contador++);

    //window.location.reload(true);
  };
  if (token && User.role == "admin") {
    return (
      <div>
        <NavBarAdmin></NavBarAdmin>

        <div className={`${styles.center}`}>
          <div>
            <table>
              <tbody>
                <div className={`${styles.divisor}`}></div>

                <tr className={`${styles.table}`}>
                  <th>Id</th>

                  <th>Nombre</th>

                  <th>Descripcion</th>

                  <th>Precio</th>
                </tr>

                {products &&
                  products.map((product, i) => (
                    <tr key={product.id}>
                      <td className={`${styles.product}`}>{product.id}</td>

                      <Link
                        className={`${styles.leenk}`}
                        to={`/admin/product_detail/${product.id}`}
                      >
                        <td
                          style={{ textAlign: "left" }}
                          className={`${styles.product2}`}
                        >
                          {product.name}
                        </td>
                      </Link>

                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        {product.description.substring(0, 100) + "..."}
                      </td>

                      <td className={`${styles.product}`}>{product.price}</td>

                      <td
                        style={{ textAlign: "left" }}
                        className={`${styles.product}`}
                      >
                        <button
                          className={`${styles.button3}`}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Usuario no autorizado</p>;
  }
}
