import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProductToCart, getProductById } from "../../../../redux/actions";
import ProductReviews from "../ProductReviews/ProductReviews";
import jwt from "jsonwebtoken";

export default function ProductDetail({ match }) {
  const { id } = match.params;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  let product = useSelector((state) => state.product);

  return (
    <div>
      {product ? (
        <div key={id}>
          <div className="productDetailTitle">
            <h1>{product.name}</h1>
          </div>
          {
            <div className="productImg">
              {product.ProductPhotos &&
                product.ProductPhotos.map((p, i) => (
                  <img
                    src={product.ProductPhotos[i].url}
                    alt={product.name}
                  ></img>
                ))}
            </div>
          }
          <div className="productDetails">
            <h3>{product.size}</h3>
            <h2>{product.description}</h2>
            <h2>{product.price} USD</h2>
          </div>

          <ProductReviews reviews={product.reviews}></ProductReviews>
        </div>
      ) : null}
    </div>
  );
}
