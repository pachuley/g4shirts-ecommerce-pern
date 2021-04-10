import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, getProductsByCategory } from "../../../redux/actions";
import { Link } from "react-router-dom";
import styles from "./Categories.module.css";

export default function Categories() {
  const categories = useSelector((state) => state.categories);

  const dispatch = useDispatch();
  useEffect(() => {
    if (categories === undefined) {
      dispatch(getCategories());
    }
  }, [dispatch]);

  return (
    <div className={`${styles.categoryContainer}`}>
      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <div key={categories.id} style={{ margin: 30 }}>
            <div>
              <Link to={"/product-category"}>
                <button
                  className={`${styles.buttonCategory}`}
                  onClick={() => {
                    dispatch(getProductsByCategory(category.id));
                  }}
                >
                  {" "}
                  {category.name}
                </button>
              </Link>
            </div>
          </div>
        ))}
      <Link to={"/"}>
        <button className={`${styles.buttonClose}`}>
          <i className="fas fa-times"></i>
        </button>
      </Link>
    </div>
  );
}
