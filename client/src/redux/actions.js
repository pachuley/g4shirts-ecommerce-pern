import {
  //Product Imports

  CREATE_PRODUCT,
  //ADD_PRODUCT,
  ADD_CATEGORY_TO_PRODUCT,
  GET_PRODUCT,
  CREATE_PRODUCT_REVIEW,

  //GET_PRODUCT_BY_SEARCH,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_CATEGORY,
  EDIT_PRODUCT,
  EDIT_PRODUCT_STOCK,
  DELETE_PRODUCT,

  //Category Imports
  ADD_CATEGORY,
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID,
  GET_CATEGORY_BY_PRODUCT_ID,
  EDIT_CATEGORY,
  DELETE_CATEGORY,
  DELETE_PRODUCT_CATEGORY,

  //Cart Imports
  ADD_PRODUCT_TO_CART,
  INCREMENT_SIZE_AMOUNT,
  DECREMENT_SIZE_AMOUNT,
  DELETE_PRODUCT_CART,
  CLEAR_CART,
  USER_ORDER_DETAILS,

  //User Imports
  USER_REGISTER,
  GET_USERS,
  USER_DATA,
  USER_PROMOTE,
  USER_DEGRADE,
  USER_DELETE,
  USER_LOGIN,
  USER_LOGOUT,
  USER_ME,
  USER_DETAILS,
  USER_UPDATE,
  PASSWORD_RESET,
  CHANGE_PASSWORD,
  PASSWORD_LINK_RESET,

  //Order Imports
  GET_ORDERS,
  CHANGE_ORDER_STATE,
  GET_FILTER_ORDERS,
  GET_ORDERS_STATE_USERID,
  GET_EXACT_ORDER,
  //ADD_ORDER_DETAIL,
  ALL_ORDERS_STATEID,
  ALL_ORDERS_FILTER_BY_STATE,
  SEND_PACKAGE_EMAIL,
  CREATE_ACTIVE_ORDER,

  //Checkout Imoprts
  MAKE_PAYMENT,
  MERCADOPAGO_PAYMENT,
  MERCADO_PAGO_CHECKOUT,
} from "./constants";

import axios from "axios";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";

const { REACT_APP_API_URL } = process.env;
const token = window.localStorage.getItem("token");
const decoded = token ? jwt_decode(token) : "";

const mostrarAlerta = () => {
  swal({
    text: "Tiempo de sesion expirado, inicie sesion nuevamente",
    buttons: "Aceptar",
  }).then((respuesta) => {
    window.location.replace("/");
  });
};

(function () {
  axios.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : undefined;
})();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem("token");
      if (token) {
        mostrarAlerta();
      }
    }
    return error;
  }
);

//Product Actions

// export const addProduct = (input) => {
//   const { name, description, price, stock, size, categoryId } = input;
//   return function (dispatch) {
//     axios
//       .post(`${REACT_APP_API_URL}/products/create`, {
//         name,
//         description,
//         price,
//         stock,
//         size,
//         categoryId,
//       })
//       .then((data) => dispatch({ type: ADD_PRODUCT, payload: data.data }));
//   };
// };

export const createProduct = (input, stock, imagesProduct = null) => {
  const { name, description, price, categories } = input;

  let data = new FormData();

  data.set("name", name);
  data.set("description", description);
  data.set("price", price);

  data.set("sizes", "XS,S,M,L,XL,XXL");
  data.set(
    "stock",
    `${stock.XS},${stock.S},${stock.M},${stock.L},${stock.XL},${stock.XXL}`
  );

  data.set("categories", categories.toString());

  let i = 1;
  for (const file of imagesProduct.files) {
    data.append("file" + i, file, file.name);
    i++;
  }

  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/products/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((data) => dispatch({ type: CREATE_PRODUCT, payload: data.data }))
      .catch((error) => {
        console.log(error);
      });
  };

  // return function (dispatch) {
  //   axios
  //     .post(`${REACT_APP_API_URL}/products/create`, {
  //       name,
  //       description,
  //       price,
  //       stock,
  //       photos,
  //       categories,
  //     })
  //     .then((data) => dispatch({ type: CREATE_PRODUCT, payload: data.data }));
  // };
};

export const getProducts = (input) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_API_URL}/products`).then((data) =>
      dispatch({
        type: GET_PRODUCT,
        payload: data.data
          ? data.data.filter((product) =>
              product.name.toLowerCase().includes(input ? input : "")
            )
          : [],
      })
    );
  };
};

export const getProductsByCategory = (category, input) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/products/category/all/${category}`)
      .then((data) =>
        dispatch({
          type: GET_PRODUCT_BY_CATEGORY,
          payload: data.data
            ? data.data.filter((product) =>
                product.name.toLowerCase().includes(input ? input : "")
              )
            : [],
          category: category,
        })
      );
  };
};

/* export const getProductBySearch = (productName) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/products/search/${productName}`)
      .then((data) =>
        dispatch({ type: GET_PRODUCT_BY_SEARCH, payload: data.data })
      );
  };
}; */

export const getProductById = (productId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/products/exact/${productId}`)
      .then((data) =>
        dispatch({ type: GET_PRODUCT_BY_ID, payload: data.data })
      );
  };
};

//Category Actions

export const addCategory = (newCategory) => {
  const { name, description } = newCategory;
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/categories/create`, { name, description })
      .then((data) => dispatch({ type: ADD_CATEGORY, payload: data.data }));
  };
};

export const getCategories = () => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/categories`)
      .then((data) => dispatch({ type: GET_CATEGORIES, payload: data.data }));
  };
};

export const getCategoryById = (categoryId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/categories/exact/${categoryId}`)
      .then((data) =>
        dispatch({ type: GET_CATEGORY_BY_ID, payload: data.data })
      );
  };
};

export const deleteCategory = (categoryId) => {
  return function (dispatch) {
    axios
      .delete(`${REACT_APP_API_URL}/categories/delete/${categoryId}`)
      .then((data) => dispatch({ type: DELETE_CATEGORY, payload: data.data }));
  };
};

export const editCategory = (categoryId, input) => {
  const { name, description } = input;
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/categories/update/${categoryId}`, {
        name,
        description,
      })
      .then((data) => dispatch({ type: EDIT_CATEGORY, payload: data.data }));
  };
};

export const addCategoryToProduct = (productId, categoryId) => {
  return function (dispatch) {
    axios
      .post(
        `${REACT_APP_API_URL}/products/category/add/${productId}/${categoryId}`
      )
      .then((data) =>
        dispatch({ type: ADD_CATEGORY_TO_PRODUCT, payload: data.data })
      );
  };
};

export const getCategoriesByProduct = (productId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/categories/products/${productId}`)
      .then((data) =>
        dispatch({
          type: GET_CATEGORY_BY_PRODUCT_ID,
          payload: data.data,
        })
      );
  };
};

export const createProductReview = (input) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/reviews/create`, input)
      .then((data) =>
        dispatch({ type: CREATE_PRODUCT_REVIEW, payload: data.data })
      );
  };
};

export const deleteProductCategory = (productId, categoryId) => {
  return function (dispatch) {
    axios
      .delete(
        `${REACT_APP_API_URL}/products/category/delete/${productId}/${categoryId}`
      )
      .then((data) =>
        dispatch({
          type: DELETE_PRODUCT_CATEGORY,
          payload: data.data,
        })
      );
  };
};

export const deleteProduct = (productId) => {
  return function (dispatch) {
    axios
      .delete(`${REACT_APP_API_URL}/products/delete/${productId}`)
      .then((data) =>
        dispatch({
          type: DELETE_PRODUCT,
          payload: data.data,
        })
      );
  };
};

export const editProduct = (productId, input) => {
  const { name, description, price, REACT_APP_API_URL } = input;
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/products/update/${productId}`, {
        name,
        description,
        price,
        REACT_APP_API_URL,
      })
      .then((data) =>
        dispatch({
          type: EDIT_PRODUCT,
          payload: data.data,
        })
      );
  };
};

export const editProductStock = (productId, stock, size) => {
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/products/stock/update/${productId}`, {
        stock,
        size,
      })
      .then((data) =>
        dispatch({
          type: EDIT_PRODUCT_STOCK,
          payload: data.data,
        })
      );
  };
};

export const addProductToCart = (input, productId) => {
  const { name, price, amount, size, url } = input;
  if (token) {
    console.log(`${REACT_APP_API_URL}/orders/add`);
    return function (dispatch) {
      axios
        .post(`${REACT_APP_API_URL}/orders/add`, {
          userId: decoded.id,
          name: name,
          price: price,
          size: size,
          productId: productId,
          url: url,
        })
        .then((data) =>
          dispatch({
            type: ADD_PRODUCT_TO_CART,
            payload: data.data,
          })
        );
    };
  } else {
    if (name && REACT_APP_API_URL && price >= 0 && size && productId >= 0) {
      const pid = productId + "." + size;
      let cart = window.localStorage.getItem("cart");
      if (cart) {
        cart = JSON.parse(cart);
        const product = cart.find((id) => id.id === pid);
        if (product) {
          cart = cart.filter((id) => id.id !== pid);
          product.amount++;
          cart = [...cart, product];
        } else {
          cart = [
            ...cart,
            {
              id: pid,
              productId: productId,
              name: name,
              price: price,
              amount: amount,
              size: size,
              REACT_APP_API_URL: REACT_APP_API_URL,
            },
          ];
        }
      } else {
        cart = [].concat({
          id: pid,
          productId: productId,
          name: name,
          price: price,
          amount: amount,
          size: size,
          REACT_APP_API_URL: REACT_APP_API_URL,
        });
      }
      //cart.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));
      cart = cart.sort(function (a, b) {
        if (a.id > b.id) {
          return 1;
        }
        if (a.id < b.id) {
          return -1;
        }
        return 0;
      });
      window.localStorage.setItem("cart", JSON.stringify(cart));
      return { type: ADD_PRODUCT_TO_CART, payload: cart };
    } else {
      return { type: ADD_PRODUCT_TO_CART, payload: "Nothing added." };
    }
  }
};

export const incrementSizeAmount = (product) => {
  let cart = window.localStorage.getItem("cart");
  if (token) {
    if (product.amount < 99) {
      return function (dispatch) {
        axios
          .put(`${REACT_APP_API_URL}/orders/amount/increment`, {
            pid: product.productId,
            id: product.id,
            size: product.size,
            amount: product.amount,
          })
          .then((data) =>
            dispatch({
              type: INCREMENT_SIZE_AMOUNT,
              payload: data.data,
            })
          );
      };
    } else {
      return function (dispatch) {
        axios.get(`${REACT_APP_API_URL}/products`).then((data) =>
          dispatch({
            type: GET_PRODUCT,
            payload: data.data.filter((product) => product),
          })
        );
      };
    }
  } else {
    if (cart) {
      cart = JSON.parse(cart);
      let productCard = cart.find(({ id }) => id === product.id);
      if (productCard) {
        cart = cart.filter((p) => p.id !== product.id);
        if (productCard.amount < 99) {
          productCard.amount++;
        }
        cart = [...cart, productCard];
      }
    }
    cart = cart.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    window.localStorage.setItem("cart", JSON.stringify(cart));
    return function (dispatch) {
      dispatch({ type: INCREMENT_SIZE_AMOUNT, payload: cart });
    };
  }
};

export const decrementSizeAmount = (product) => {
  let cart = window.localStorage.getItem("cart");
  if (token) {
    if (product.amount > 1) {
      return function (dispatch) {
        axios
          .put(`${REACT_APP_API_URL}/orders/amount/decrement/${product.id}`)
          .then((data) =>
            dispatch({
              type: DECREMENT_SIZE_AMOUNT,
              payload: data.data,
            })
          );
      };
    } else {
      return function (dispatch) {
        axios.get(`${REACT_APP_API_URL}/products`).then((data) =>
          dispatch({
            type: GET_PRODUCT,
            payload: data.data.filter((product) => product),
          })
        );
      };
    }
  } else {
    if (cart) {
      cart = JSON.parse(cart);
      let productCard = cart.find(({ id }) => id === product.id);
      if (productCard) {
        cart = cart.filter((p) => p.id !== product.id);
        if (productCard.amount > 1) {
          productCard.amount--;
        }
        cart = [...cart, productCard];
      }
    }
    cart = cart.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });
    window.localStorage.setItem("cart", JSON.stringify(cart));
    return function (dispatch) {
      dispatch({ type: DECREMENT_SIZE_AMOUNT, payload: cart });
    };
  }
};

export const deleteProductCart = (product) => {
  if (token) {
    return function (dispatch) {
      axios
        .delete(`${REACT_APP_API_URL}/orders/delete/${product.id}`)
        .then((data) =>
          dispatch({
            type: DELETE_PRODUCT_CART,
            payload: data.data,
          })
        );
    };
  } else {
    let cart = window.localStorage.getItem("cart");
    cart = JSON.parse(cart).filter((p) => p.id !== product.id);
    window.localStorage.setItem("cart", JSON.stringify(cart));
    return function (dispatch) {
      dispatch({ type: DELETE_PRODUCT_CART, payload: cart });
    };
  }
};

export const clearCart = (userId) => {
  if (token) {
    return function (dispatch) {
      axios
        .delete(`${REACT_APP_API_URL}/orders/all/delete/${userId}`)
        .then((data) =>
          dispatch({
            type: DELETE_PRODUCT_CART,
            payload: data.data,
          })
        );
    };
  } else {
    window.localStorage.removeItem("cart");
    return function (dispatch) {
      dispatch({ type: CLEAR_CART, payload: null });
    };
  }
};

export const userRegister = (register) => {
  const {
    email,
    password,
    name,
    surname,
    birthday,
    country,
    state,
    city,
    postalcode,
    street,
    number,
  } = register;
  const cart = JSON.parse(window.localStorage.getItem("cart"));
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/users/register`, {
        email,
        password,
        name,
        surname,
        birthday,
        country,
        state,
        city,
        postalcode,
        street,
        number,
        cart: cart,
      })
      .then((data) => {
        if (data.data === "Registered succesfully.") {
          window.localStorage.removeItem("cart");
          swal({
            text: "Usuario Registrado exitosamente",
            buttons: "Aceptar",
          }).then((respuesta) => {
            window.location.replace("/");
          });
        }
        dispatch({ type: USER_REGISTER, payload: data.data });
      });
  };
};

export const userLogin = (login) => {
  const { email, password } = login;
  const token = window.localStorage.getItem("token");
  const cart = JSON.parse(window.localStorage.getItem("cart"));
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/users/login`, { email, password, cart })
      .then((data) => {
        if (token) {
          window.localStorage.removeItem("token");
        }
        if (cart) {
          window.localStorage.removeItem("cart");
        }
        window.localStorage.setItem("token", data.data.token);
        dispatch({ type: USER_LOGIN, payload: data.data.token });
        dispatch({ type: USER_DATA, payload: data.data.userData });

        if (data.data.userData.roleId === "1")
          window.localStorage.removeItem("cart"); // Incluido por León

        window.location.replace("/");
      })
      .catch((err) =>
        dispatch({
          type: USER_LOGIN,
          payload: "The email or the password are incorrect.",
        })
      );
  };
};

export const userUpdate = (id, datos) => {
  const {
    email,
    password,
    name,
    surname,
    birthday,
    country,
    state,
    city,
    postalcode,
    street,
    number,
  } = datos;
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/users/update/${id}`, {
        email,
        password,
        name,
        surname,
        birthday,
        country,
        state,
        city,
        postalcode,
        street,
        number,
      })
      .then((data) => dispatch({ type: USER_UPDATE, payload: data.data }))
      .catch((err) => alert("Error happened."));
  };
};

export const getUsers = () => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/users`)
      .then((data) => dispatch({ type: GET_USERS, payload: data.data }))
      .catch((err) => alert("No authorized."));
  };
};

export const getUserDetails = (id) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/users/exact/${id}`)
      .then((data) => dispatch({ type: USER_DETAILS, payload: data.data }));
  };
};

export const getOrdersUser = (userId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/orders/state/active/${userId}`)
      .then((data) => {
        dispatch({ type: USER_ORDER_DETAILS, payload: data.data });
      })
      .catch((err) => alert(err));
  };
};

export const userLogout = () => {
  return function (dispatch) {
    window.localStorage.removeItem("token");
    dispatch({ type: USER_LOGOUT, payload: "" });
  };
};

export const userMe = () => {
  return function (dispatch) {
    axios.get(`${REACT_APP_API_URL}/users/me`).then((data) => {
      dispatch({ type: USER_ME, payload: data.data });
    });
  };
};

export const getOrders = () => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/orders`)
      .then((data) => dispatch({ type: GET_ORDERS, payload: data.data }));
  };
};

export const changeOrderState = (orderId, props) => {
  const state = props;
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/orders/state/update/${orderId}`, {
        state,
      })
      .then((data) =>
        dispatch({
          type: CHANGE_ORDER_STATE,
          payload: data.data,
        })
      );
  };
};

export const getFilterOrders = (state) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/orders/state/${state}`)
      .then((data) =>
        dispatch({ type: GET_FILTER_ORDERS, payload: data.data })
      );
  };
};

export const getOrdersStateUserId = (state, userId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/orders/state/${state}/${userId}`)
      .then((data) =>
        dispatch({ type: GET_ORDERS_STATE_USERID, payload: data.data })
      );
  };
};

export const getAllOrdersStateUserId = (state, userId) => {
  return function (dispatch) {
    axios
      .get(`${REACT_APP_API_URL}/orders/filterState/${state}/${userId}`)
      .then((data) =>
        dispatch({ type: ALL_ORDERS_STATEID, payload: data.data })
      );
  };
};

export const userPromote = (idUser) => {
  return function (dispatch) {
    axios.put(`${REACT_APP_API_URL}/users/promote/${idUser}`).then((data) =>
      dispatch({
        type: USER_PROMOTE,
        payload: data.data,
      })
    );
  };
};

export const userDegrade = (idUser) => {
  return function (dispatch) {
    axios.put(`${REACT_APP_API_URL}/users/degrade/${idUser}`).then((data) =>
      dispatch({
        type: USER_DEGRADE,
        payload: data.data,
      })
    );
  };
};

export const userDelete = (idUser) => {
  return function (dispatch) {
    axios.delete(`${REACT_APP_API_URL}/users/delete/${idUser}`).then((data) =>
      dispatch({
        type: USER_DELETE,
        payload: data.data,
      })
    );
  };
};

export const getExactOrder = (orderId) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_API_URL}/orders/exact/${orderId}`).then((data) =>
      dispatch({
        type: GET_EXACT_ORDER,
        payload: data.data,
      })
    );
  };
};

export const makePayment = (payment) => {
  console.log(payment);
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/orders/checkout`, {
        userId: payment.userId,
        userEmail: payment.userEmail,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        total: payment.total,
      })

      .then((data) =>
        dispatch({
          type: MAKE_PAYMENT,
          payload: data.data,
        })
      );
  };
};

export const passwordChange = (id, password, oldPassword, email) => {
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/users/passwordChange/${id}`, {
        password,
        oldPassword,
        email,
      })
      .then((data) => dispatch({ type: CHANGE_PASSWORD, payload: data.data }));
  };
};

export const passwordEmailReset = (userEmail) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/users/passwordLinkReset`, {
        userEmail,
      })
      .then((data) => dispatch({ type: PASSWORD_RESET, payload: data.data }));
  };
};

export const passwordReset = (userId, newPassword) => {
  return function (dispatch) {
    axios
      .put(`${REACT_APP_API_URL}/users/passwordReset/${userId}`, {
        newPassword,
      })
      .then((data) =>
        dispatch({ type: PASSWORD_LINK_RESET, payload: data.data })
      );
  };
};

export const sendPackageEmail = (user, orderId) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/orders/complete`, {
        user,
        orderId,
      })
      .then((data) =>
        dispatch({ type: SEND_PACKAGE_EMAIL, payload: data.data })
      );
  };
};

export const allOrderFilterByState = (state) => {
  return function (dispatch) {
    axios.get(`${REACT_APP_API_URL}/orders/filter/${state}`).then((data) => {
      dispatch({
        type: ALL_ORDERS_FILTER_BY_STATE,
        payload: data.data,
      });
    });
  };
};

export const mercadopagoPayment = (preference) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/mercadopago`, { preference })
      .then((data) => {
        dispatch({
          type: MERCADOPAGO_PAYMENT,
          payload: data.data,
        });
      });
  };
};

export const createActiveOrder = (userId, userEmail) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/orders/createActive`, { userId, userEmail })
      .then((data) => {
        dispatch({
          type: CREATE_ACTIVE_ORDER,
          payload: data.data,
        });
      });
  };
};

export const mercadopagoCheckout = (userId, userEmail, orderId) => {
  return function (dispatch) {
    axios
      .post(`${REACT_APP_API_URL}/mercadopago/checkout`, {
        userId,
        userEmail,
        orderId,
      })
      .then((data) => {
        dispatch({
          type: MERCADO_PAGO_CHECKOUT,
          payload: data.data,
        });
      });
  };
};
