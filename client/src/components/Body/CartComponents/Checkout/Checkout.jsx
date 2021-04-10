import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExactOrder,
  makePayment,
  getUserDetails,
  mercadopagoPayment,
  userUpdate,
} from "../../../../redux/actions";
import style from "./Checkout.module.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
const { REACT_APP_CLIENT_URL } = process.env;

const stripePromise = loadStripe(
  "pk_test_51IZ69ADth4KCYGlusXKX59EUEOTfwEykD8aSUyIEFxZkUoevtwbVcoDwuzfrporuG6k8smbqsRsARzYob1fohlGl00DGs0wexx"
);

function Wrapper({ match }) {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const states = useSelector((state) => state);
  const detailsUser = useSelector((state) => state.userDetails);
  const token = window.localStorage.getItem("token");
  const decoded = token ? jwt_decode(token) : "";
  let [counter, setCounter] = useState(0);
  const [input, setInput] = useState({ active: false, picked: "" });
  const [showMore, setShowMore] = useState(false);
  const [adress, setAddress] = useState({
    country: "",
    state: "",
    city: "",
    postalcode: "",
    street: "",
    number: "",
  });
  let total = 0;
  const address =
    detailsUser &&
    detailsUser.street &&
    detailsUser.number &&
    detailsUser.postalcode &&
    detailsUser.city &&
    detailsUser.state &&
    detailsUser.country
      ? detailsUser.street +
        " " +
        detailsUser.number +
        ", CP" +
        detailsUser.postalcode +
        ", " +
        detailsUser.city +
        ", " +
        detailsUser.state +
        ", " +
        detailsUser.country
      : "Registre su direccion";

  useEffect(() => {
    dispatch(getExactOrder(match.params.orderId));
    setInput({ active: false, picked: "" });
    dispatch(getUserDetails(decoded.id));
  }, [dispatch, counter]);

  const handleChange = (e) => {
    if (address != "Registre su direccion") {
      setInput({ active: true, picked: e.target.value });
    } else {
      swal({
        text: "Debes registrar tu dirección",
        buttons: "Aceptar",
      });
    }
  };
  const handleChange2 = () => {
    if (address != "Registre su direccion") {
      setInput({ active: true, picked: "Efectivo" });
      handleClickMercadopago();
    } else {
      swal({
        text: "Debes registrar tu dirección",
        buttons: "Aceptar",
      });
    }
  };
  const handleChange3 = (e) => {
    setAddress({ ...adress, [e.target.name]: e.target.value });
  };

  const mostrarAlerta = () => {
    swal({
      text: "Pago exitoso",
      buttons: "Aceptar",
      icon: "success",
    }).then((respuesta) => {
      window.location.replace("/");
    });
  };

  const handleSubmit = async (e) => {
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      const userId = decoded.id;
      const userEmail = decoded.email;
      const orderId = match.params.orderId;
      const paymentId = paymentMethod.id;
      try {
        dispatch(
          makePayment({
            userId: userId,
            userEmail: userEmail,
            orderId: orderId,
            paymentId: paymentId,
            total: parseFloat(total).toFixed(2) * 100,
          })
        );
        elements.getElement(CardElement).clear();
        mostrarAlerta();
        //window.location.href = "/";
      } catch (error) {
        alert("Algo no salió bien. Inténtelo mas tarde.");
        console.log(error);
      }
    }
  };
  if (states.order) {
    states.order.OrderDetails &&
      states.order.OrderDetails.map((orderDetail) => {
        total = total + orderDetail.price * orderDetail.amount;
      });
  }

  const handleClickMercadopago = () => {
    const preference = {
      items: [],
      back_urls: {
        failure: `${REACT_APP_CLIENT_URL}/mercadopago/fail`,
        pending: `${REACT_APP_CLIENT_URL}/mercadopago/fail`,
        success: `${REACT_APP_CLIENT_URL}/mercadopago/success`,
      },
    };
    states.order.OrderDetails.map((orderDetail) => {
      preference.items.push({
        title: orderDetail.name,
        unit_price: parseFloat(orderDetail.price),
        quantity: orderDetail.amount * 92, //DOLAR => PESO ARG
      });
    });
    dispatch(mercadopagoPayment(preference));
  };

  const handleFinishMercadopago = async () => {
    if (states.mercadopagoResponse) {
      const userEmail = decoded.email;
      //alert("Se lo redirigirá a su pago");
      swal({
        text: "Se lo redirigirá a su pago",
        buttons: "Aceptar",
        icon: "success",
      }).then((respuesta) => {
        window.location.href = states.mercadopagoResponse.body.init_point;
      });
      //window.location.href = states.mercadopagoResponse.body.init_point;
    }
  };

  const { country, state, city, postalcode, street, number } = adress;

  const enviarCambiosAddress = () => {
    setCounter(counter++);
    dispatch(
      userUpdate(decoded.id, {
        country,
        state,
        city,
        postalcode,
        street,
        number,
      })
    );
    setCounter(counter++);
    dispatch(getUserDetails(decoded.id));
    setCounter(counter++);
  };
  const cambios = useSelector((state) => state.userUpdate);

  if (token) {
    return (
      <div className={style.divPadre}>
        <div className={style.div1}>
          <h3 className={style.tituloResumen}>Resumen final</h3>
          <div>
            <table>
              <tbody>
                <tr>
                  <th className={style.list}>Producto</th>
                  <th className={style.list}>Talle</th>
                  <th className={style.list}>Cantidad</th>
                  <th className={style.list}>Precio</th>
                </tr>
                {states.order &&
                  states.order.OrderDetails &&
                  states.order.OrderDetails.map((orderDetail) => (
                    <tr>
                      <td className={style.listItemText}>{orderDetail.name}</td>
                      <td className={style.listItem}>{orderDetail.size}</td>
                      <td className={style.listItemText}>
                        {orderDetail.amount}
                      </td>
                      <td className={style.listItemText}>
                        {" "}
                        {parseFloat(
                          orderDetail.price * orderDetail.amount
                        ).toFixed(2)}{" "}
                        USD
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div>
            {total && (
              <div className={style.ticket}>
                <div className={style.total}>TOTAL</div>
                <div className={style.totalNumerico}>
                  {parseFloat(total).toFixed(2)} USD
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={style.div2}>
          <div className={style.internDiv1}>
            <div>
              <h1>Ingresá los datos</h1>{" "}
            </div>
          </div>
          <div className={style.internDiv2}>
            <label>Te lo enviaremos a:</label>
            <label>{detailsUser ? address : ""}</label>
            <button
              className={style.changeAdress}
              onClick={() => setShowMore(showMore ? false : true)}
            >
              {!showMore ? "Crear o Modificar" : "Mostrar menos"}
            </button>
            {showMore ? (
              <div>
                <h1>Edita tu direccion </h1>

                <div style={{ display: "flex" }}>
                  <div>
                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="street"
                      >
                        Calle
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={street}
                        onChange={handleChange3}
                      />
                    </div>

                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="number"
                      >
                        Numero
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="number"
                        name="number"
                        value={number}
                        onChange={handleChange3}
                      />
                    </div>

                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="postalcode"
                      >
                        Codigo Postal
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="postalcode"
                        name="postalcode"
                        value={postalcode}
                        onChange={handleChange3}
                      />
                    </div>
                  </div>

                  <div>
                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="city"
                      >
                        Ciudad
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={city}
                        onChange={handleChange3}
                      />
                    </div>

                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="state"
                      >
                        Provincia
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={state}
                        onChange={handleChange3}
                      />
                    </div>

                    <div>
                      <label
                        style={{ color: "white", fontWeight: "lighter" }}
                        for="country"
                      >
                        Pais
                      </label>
                    </div>

                    <div>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        onChange={handleChange3}
                      />
                    </div>
                  </div>
                </div>

                {country && state && city && postalcode && street && number ? (
                  <button
                    className={style.changeAdress}
                    onClick={() => enviarCambiosAddress()}
                  >
                    GUARDAR
                  </button>
                ) : null}
                {cambios ? <p>{cambios}</p> : null}
              </div>
            ) : null}
          </div>
          <div className={style.internDiv3}>
            <label>Método de pago</label>
            <div>
              <div>
                <button
                  className={style.button1}
                  value="Efectivo"
                  onClick={() => {
                    handleChange2();
                  }}
                >
                  MERCADOPAGO
                </button>
                <button
                  className={style.button2}
                  value="Tarjeta"
                  onClick={handleChange}
                >
                  STRIPE
                </button>
              </div>
              <div>
                {input.active === true && input.picked === "Efectivo" && (
                  <div className={style.medioEfvo}>
                    <button
                      className={style.buttonMedioEfvo}
                      onClick={handleFinishMercadopago}
                    >
                      FINALIZAR COMPRA
                    </button>
                  </div>
                )}
                {input.active === true && input.picked === "Tarjeta" && (
                  <div className={style.medioTarjeta}>
                    <CardElement className={style.cardElement} />
                    <button
                      onClick={handleSubmit}
                      className={style.buttonMedioTarjeta}
                    >
                      FINALIZAR COMPRA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ marginTop: "3em" }}>
        <label>
          Debes Iniciar Sesión o Registrarte para continuar tu compra
        </label>
      </div>
    );
  }
}

export default function Checkout({ match }) {
  return (
    <Elements stripe={stripePromise}>
      <Wrapper match={match} />
    </Elements>
  );
}
