import React, { useState } from "react";
import ProductCard from "../../ProductComponents/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getProducts } from "../../../../redux/actions";
import styles from "./Catalogue.module.css";
import Pagination from "./Pagination";

export default function Catalogue() {
  const products = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(9);

  let indexOfLastRecipe = currentPage * resultsPerPage;
  let indexOfFirstRecipe = indexOfLastRecipe - resultsPerPage;
  let currentProducts =
    products && products.length > 9
      ? products.slice(indexOfFirstRecipe, indexOfLastRecipe)
      : products;

  const dispatch = useDispatch();
  useEffect(() => {
    if (products === undefined) {
      dispatch(getProducts());
    }
  }, [dispatch]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className={`${styles.catalogueContainer}`}>
      <div className={`${styles.productCardContainer}`}>
        {currentProducts &&
          currentProducts.length > 0 &&
          currentProducts.map((product) => (
            //en css modules, establecer esta sección como grilla
            <div
              className={`${styles.productCard}`}
              key={product.id}
              style={{ margin: 30 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                url={product.ProductPhotos}
                size={product.size}
                description={product.description}
                price={product.price}
                productSizes={product.ProductSizes}
                categories={product.categories}
                reviews={product.reviews}
              ></ProductCard>
            </div>
          ))}
      </div>

      <div className={`${styles.paginationContainer}`}>
        <Pagination
          resultsPerPage={resultsPerPage}
          totalResults={products && products.length > 0 && products.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
}
