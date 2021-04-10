import React, {useState} from "react";
import Modal from 'react-modal'
import {useDispatch} from "react-redux";
import styles from "./ModalsStyles.module.css"

Modal.setAppElement('#root')

export default function LogginButton(match) {

    let orders = match.match.OrderDetails

    //MODAL
    const [modalIsOpen, setModalIsOpen] = useState(false)

    return (
        <div>
            <button style={{
                border:"none", backgroundColor: "#3c3c3c", color: "white", fontFamily:"Poppins", padding: 10, borderRadius: 5, cursor:"pointer", outline:"none"
            }} onClick={() => setModalIsOpen(true)}>Detalles</button>

            <Modal className={`${styles.detailsModal}`} style={{overlay: {backgroundColor: "rgba(0, 0, 0, 0.5)"}}}
                   isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <div style={{width:"100%", height:"100%"}}>
                    <button className={`${styles.closeButton2}`} onClick={() => setModalIsOpen(false)}><i
                        className="fas fa-times"></i></button>
                    <h1>OrderId: {match.match.id}</h1>
                    <table style={{marginLeft:60}}>
                        <thead>
                        <tr className={`${styles.table}`}>
                            <th>Id</th>
                            <th>Amount</th>
                            <th>Price</th>
                            <th>Size</th>
                            <th>ProductId</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders &&
                            orders.map((order) => (
                            <tr key={order.id}>
                                <td

                      className={`${styles.product}`}
                    >{order.id}</td>
                                <td

                      className={`${styles.product}`}
                    >{order.amount}</td>
                                <td

                      className={`${styles.product}`}
                    >{order.price}</td>
                                <td

                      className={`${styles.product}`}
                    >{order.size}</td>
                                <td

                      className={`${styles.product}`}
                    >{order.productId}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>

        </div>

    );
}
