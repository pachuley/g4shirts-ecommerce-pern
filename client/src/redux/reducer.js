import {
  GET_PRODUCT,
  //GET_PRODUCT_BY_SEARCH,
  ADD_CATEGORY,
  GET_PRODUCT_BY_ID,
  GET_CATEGORIES,
  GET_CATEGORY_BY_ID,
  DELETE_CATEGORY,
  EDIT_CATEGORY,
  //ADD_PRODUCT,
  CREATE_PRODUCT,
  ADD_CATEGORY_TO_PRODUCT,
  GET_CATEGORY_BY_PRODUCT_ID,
  DELETE_PRODUCT_CATEGORY,
  DELETE_PRODUCT,
  DELETE_PRODUCT_CART,
  CLEAR_CART,
  GET_PRODUCT_BY_CATEGORY,
  EDIT_PRODUCT,
  EDIT_PRODUCT_STOCK,
  ADD_PRODUCT_TO_CART,
  USER_ORDER_DETAILS,
  CREATE_PRODUCT_REVIEW,
  //USER
  USER_REGISTER,
  GET_USERS,
  USER_LOGIN,
  USER_DATA,
  USER_PROMOTE,
  USER_DEGRADE,
  USER_DELETE,
  USER_ME,
  USER_DETAILS,
  USER_UPDATE,
  PASSWORD_RESET,
  PASSWORD_LINK_RESET,
  CHANGE_PASSWORD,
  //ORDERS
  GET_ORDERS,
  CHANGE_ORDER_STATE,
  GET_FILTER_ORDERS,
  GET_ORDERS_STATE_USERID,
  USER_LOGOUT,
  INCREMENT_SIZE_AMOUNT,
  DECREMENT_SIZE_AMOUNT,
  GET_EXACT_ORDER,
  ADD_ORDER_DETAIL,
  ALL_ORDERS_STATEID,
  ALL_ORDERS_FILTER_BY_STATE,
  SEND_PACKAGE_EMAIL,
  //CHECKOUTS
  MAKE_PAYMENT,
  MERCADOPAGO_PAYMENT,
  CREATE_ACTIVE_ORDER,
  MERCADO_PAGO_CHECKOUT
} from "./constants";

let initialState = {};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case GET_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };

    case GET_PRODUCT_BY_CATEGORY:
      return {
        ...state,
        productsByCategory: action.payload,
        activeCategory: action.category,
      };

    /* case GET_PRODUCT_BY_SEARCH:
      return {
        ...state,
        products: action.payload,
      }; */
    case CREATE_PRODUCT_REVIEW:
      return {
        ...state,
        review: action.payload,
      };

    case GET_PRODUCT_BY_ID:
      return {
        ...state,
        product: action.payload,
      };

    case ADD_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };

    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };

    case GET_CATEGORY_BY_ID:
      return {
        ...state,
        category: action.payload,
      };

    case DELETE_CATEGORY:
      return {
        ...state,
      };

    case EDIT_CATEGORY:
      return {
        ...state,
        category: action.payload,
      };
    // case ADD_PRODUCT:
    //   return {
    //     ...state,
    //     product: action.payload,
    //   };
    case CREATE_PRODUCT:
      return {
        ...state,
        message: action.payload,
      };

    case ADD_CATEGORY_TO_PRODUCT:
      return {
        ...state,
        product: action.payload,
      };

    case GET_CATEGORY_BY_PRODUCT_ID:
      return {
        ...state,
        productCategories: action.payload,
      };

    case DELETE_PRODUCT_CATEGORY:
      return {
        ...state,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
      };

    case EDIT_PRODUCT:
      return {
        ...state,
      };

    case EDIT_PRODUCT_STOCK:
      return {
        ...state,
      };

    case ADD_PRODUCT_TO_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case INCREMENT_SIZE_AMOUNT:
      return {
        ...state,
        cart: action.payload,
      };

    case DECREMENT_SIZE_AMOUNT:
      return {
        ...state,
        cart: action.payload,
      };

    case DELETE_PRODUCT_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case CLEAR_CART:
      return {
        ...state,
        cart: action.payload,
      };

    case USER_REGISTER:
      return {
        ...state,
        register: action.payload,
      };

    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };

    case USER_LOGIN:
      return {
        ...state,
        token: action.payload,
      };

    case USER_DATA:
      return {
        ...state,
        user_info: action.payload,
      };

    case USER_ORDER_DETAILS:
      return {
        ...state,
        user_orders: action.payload,
      };

    case USER_LOGOUT:
      return {
        ...state,
        token: action.payload,
      };

    case USER_ME:
      return {
        ...state,
        userMe: action.payload,
      };

    case USER_UPDATE:
      return {
        ...state,
        userUpdate: action.payload,
      };

    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload,
      };

    case CHANGE_ORDER_STATE:
      return {
        ...state,
        orders: action.payload,
      };

    case GET_FILTER_ORDERS:
      return {
        ...state,
        ordersFilterState: action.payload,
      };

    case GET_ORDERS_STATE_USERID:
      return {
        ...state,
        ordersStateUserId: action.payload,
      };

    case USER_PROMOTE:
      return {
        ...state,
        messageUserPromote: action.payload,
      };

    case USER_DEGRADE:
      return {
        ...state,
        messageUserDegrade: action.payload,
      };

    case USER_DELETE:
      return {
        ...state,
        messageUserDelete: action.payload,
      };

    case USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };

    case GET_EXACT_ORDER:
      return {
        ...state,
        order: action.payload,
      };

    case MAKE_PAYMENT:
      return {
        ...state,
        payment: action.payload,
      };

    case ADD_ORDER_DETAIL:
      return {
        ...state,
        orderDetail: action.payload,
      };

    case CHANGE_PASSWORD:
      return {
        ...state,
        passwordChange: action.payload,
      };

    case PASSWORD_RESET:
      return {
        ...state,
        passwordChange: action.payload,
      }

    case PASSWORD_LINK_RESET:
      return {
        ...state,
        passWordChange: action.payload
      }

    case ALL_ORDERS_STATEID:
      return {
        ...state,
        allOrdersStateId: action.payload,
      };

    case ALL_ORDERS_FILTER_BY_STATE:
      return {
        ...state,
        ordersFilters: action.payload,
      };
    case MERCADOPAGO_PAYMENT:
      return {
        ...state,
        mercadopagoResponse: action.payload,
      };
    case SEND_PACKAGE_EMAIL:
      return {
        ...state,
        allOrdersStateId: action.payload
      }
    case CREATE_ACTIVE_ORDER:
      return {
        ...state,
        createdOrder: action.payload
      }
    case MERCADO_PAGO_CHECKOUT:
      return {
        ...state,
        mercadopagoCheckout: action.payload
      }
    default:
      return state;
  }
}
