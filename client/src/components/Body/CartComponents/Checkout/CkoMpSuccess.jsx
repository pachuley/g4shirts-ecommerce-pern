import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getUserDetails,
    mercadopagoCheckout
  } from "../../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import jwt_decode from "jwt-decode";

export default function CkoMpSuccess() {
    const dispatch = useDispatch();
    const states = useSelector((state) => state);
    const token = window.localStorage.getItem("token");
    const decoded = token ? jwt_decode(token) : "";
    
    useEffect(() => {
        if(token){
            dispatch(getUserDetails(decoded.id));
        }else{window.location.href = "/"}
    }, [dispatch])
    
    const handleClick = () => {
        let orderId;
        if(states.userDetails){
            states.userDetails.orders.map((data) => {if(data.state === "Active"){orderId = data.id}});
            dispatch(mercadopagoCheckout(decoded.id, decoded.email, orderId));
        }
        window.location.href = "/";
    }

    return (
    <div style={{display:"flex", flexDirection:"column"}}>
        <label style={{fontSize:"4em", margin:"1em"}}>Tu compra se realizó con éxito</label>
        <button style={{backgroundColor:"#ff7b06", 
                        color:"white", 
                        fontFamily:"Poppins", 
                        border:"none",
                        fontSize:"1.5em",
                        width:"10em",
                        marginLeft:"40%"
                        }}
                onClick={handleClick}>Volver al Inicio
        </button>
    </div>
    )
};