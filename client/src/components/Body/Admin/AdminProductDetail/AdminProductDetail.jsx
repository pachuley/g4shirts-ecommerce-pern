import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductById,
  deleteProduct,
  addCategoryToProduct,
  deleteProductCategory,
  editProductStock,
} from "../../../../redux/actions";
import styles from "./AdminProductDetail.module.css";
import jwt from "jsonwebtoken";

export default function AdminProductDetail({ match }) {
  let product = useSelector((state) => state.product);
  const token = window.localStorage.getItem("token");
  if (token) {
    var User = jwt.decode(token);
  }
  let [counter, setCounter] = useState(0);
  let sizes =
    product &&
    product.ProductSizes &&
    product.ProductSizes.sort((a, b) =>
      a.id > b.id ? 1 : a.id < b.id ? -1 : 0
    );

  let categories = useSelector((state) => state.categories);
  const [input, setInput] = useState(0);
  const [newStock, setNewStock] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProductById(match.params.id));
  }, [counter]);

  const handleInputChange = function (e) {
    setNewStock(e.target.value);
  };

  const handleStockUpdate = function (e) {
    dispatch(editProductStock(match.params.id, newStock, e.target.value));
    window.location.reload();
  };

  const handleDeleteProduct = (e) => {
    setCounter(counter++);
    dispatch(deleteProduct(e.target.value));
    setCounter(counter++);
  };

  const handleInputChange2 = (e) => {
    setInput(e.target.value);
  };

  const handleAddCategory = (e) => {
    setCounter(counter++);
    dispatch(addCategoryToProduct(match.params.id, input));
    setCounter(counter++);
    dispatch(getProductById(match.params.id));
    setCounter(counter++);
    window.location.reload();
  };

  const handleRemoveCategory = (e) => {
    setCounter(counter++);
    dispatch(deleteProductCategory(match.params.id, e.target.value));
    setCounter(counter++);
  };

  return (
    <div>
      <div className={`${styles.ultimo}`}>
        {/*primer div*/}
        <div className={`${styles.contTituloprinc}`}>
          {product && (
            <h1 className={`${styles.tituloprinc}`}>
              ID {product.id} - {product.name}
            </h1>
          )}
          <Link to={`/admin/edit_product/${match.params.id}`}>
            <button className={`${styles.modButt}`}>MODIFICAR</button>
          </Link>
        </div>
        {/*termina primer div*/}

        {/*segundo div*/}
        <div className={`${styles.tercDiv}`}>
          <table>
            <thead>
              <tr>
                <th>
                  <h4 className={`${styles.tercDivTit}`}>Categorias</h4>
                </th>
                <th></th>
              </tr>
              <select
                className={`${styles.seleccionator}`}
                name="categoryId"
                value={input.categoryId}
                onChange={handleInputChange2}
              >
                <option value="">Selecciona la categoria</option>
                {categories &&
                  categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>

              <button
                className={`${styles.btnAsign}`}
                onClick={handleAddCategory}
              >
                ASOCIAR CATEGORÍA
              </button>
            </thead>
            <tbody>
              {product &&
                product.categories &&
                product.categories.map((category) => (
                  <tr key={category.id} style={{ color: "white" }}>
                    <td className={`${styles.thelast}`}>{category.name}</td>
                    <td>
                      <button
                        className={`${styles.btnTrash}`}
                        value={category.id}
                        onClick={handleRemoveCategory}
                      >
                        X{/* <i className="fas fa-trash-alt"></i> */}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/*termina segundo div*/}

        {/*TERCER DIV*/}
        <div className={`${styles.tableCont}`}>
          <table>
            <thead>
              <tr className={`${styles.table}`}>
                <th>Descripción</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {product && (
                <tr key={product.id}>
                  <td
                    style={{ textAlign: "left" }}
                    className={`${styles.product}`}
                  >
                    <p>{product.description}</p>
                  </td>
                  <td className={`${styles.product}`}>U$D {product.price}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/*termina tercer div*/}

        {/*cuarto div*/}
        <div className={`${styles.quinDiv}`}>
          <table>
            <thead>
              <tr className={`${styles.table}`}>
                <th>Calificación</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Titulo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {product &&
                product.reviews.map((review) => (
                  <tr key={review.id}>
                    <td className={`${styles.product}`}>{review.stars}</td>

                    <td className={`${styles.product}`}>
                      {review.user.name + " " + review.user.surname}
                    </td>
                    <td
                      style={{ textAlign: "left" }}
                      className={`${styles.product}`}
                    >
                      {review.user.email}
                    </td>
                    <td className={`${styles.product}`}>{review.title}</td>
                    <td
                      style={{ textAlign: "left" }}
                      className={`${styles.product}`}
                    >
                      {review.description}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/*termina cuarto div*/}

        {/*quinto DIV*/}

        <div className={`${styles.cuartoDiv}`}>
          <table>
            <thead>
              <tr className={`${styles.trselector}`}>
                <th>Talles</th>
                <th>Stock</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {product &&
                sizes.map((size) => (
                  <tr key={size.id}>
                    <td className={`${styles.itemSelec}`}>{size.size}</td>
                    <td className={`${styles.itemSelec}`}>{size.stock}</td>
                    <td>
                      <input
                        className={`${styles.itemSelectortor}`}
                        type="text"
                        name={size.size}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <button
                        className={`${styles.butonSelectortor}`}
                        value={size.size}
                        onClick={handleStockUpdate}
                      >
                        MODIFICAR
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/*termina quinto div*/}

        {/*SEXTO DIV*/}

        <div className={`${styles.sextodeev}`}>
          <h1 className={`${styles.sextodeevTit}`}>Fotos</h1>

          <div className={`${styles.sextodeevTit2}`}>
            {product &&
              product.ProductPhotos.map((photo) => (
                <span key={photo.id}>
                  <img
                    src={photo.url}
                    alt={photo.id}
                    className={`${styles.productPhoto}`}
                  />
                </span>
              ))}
            {product && (
              <button
                className={`${styles.trtrButt}`}
                value={product.id}
                onClick={handleDeleteProduct}
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    //    FINNN
  );
}
