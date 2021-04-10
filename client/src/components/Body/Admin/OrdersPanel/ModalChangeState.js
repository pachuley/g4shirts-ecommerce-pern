import React, {useState} from "react";
import Modal from "react-modal";
import {useDispatch} from "react-redux";
import styles from "./ModalsStyles.module.css";
import edit from "../../../images/edit.png";
import {changeOrderState} from "../../../../redux/actions";

Modal.setAppElement("#root");

export default function LogginButton(match) {
    let orderId = match.match.id;

    //MODAL
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [state, setState] = useState(match.match.state);

    const handleClick = (e) => {
        setState(e);
    };

    const dispatch = useDispatch();
    const handleConfirm = () => {
        dispatch(changeOrderState(orderId, state));
        window.location.reload();
    };

    return (
        <div>
            <button
                style={{
                    fontSize: 23,
                    border: "none",
                    background: "none",
                    color: "white",
                    fontFamily: "Poppins",
                    padding: 10,
                    borderRadius: 5,
                    cursor: "pointer",
                    outline: "none"
                }}
                onClick={() => setModalIsOpen(true)}
            >
                <i className="fas fa-edit"></i>
            </button>

            <Modal
                className={`${styles.stateModal}`}
                style={{overlay: {backgroundColor: "rgba(0, 0, 0, 0.5)"}}}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <div style={{width: "100%", height: "100%"}}>
                    <button className={`${styles.closeBtn}`} onClick={() => setModalIsOpen(false)}><i className="fas fa-times"></i></button>
                    <h1 className={`${styles.titulo}`}>ID de la orden {match.match.id}</h1>

                    <div className={`${styles.btnContainer}`}>
                        <div>
                            <button className={`${styles.bttn}`} onClick={() => handleClick("Active")}>ACTIVA</button>
                        </div>
                        <div>
                            <button className={`${styles.bttn}`} onClick={() => handleClick("Canceled")}>CANCELADA
                            </button>

                        </div>
                        <div>
                            <button className={`${styles.bttn}`} onClick={() => handleClick("Complete")}>COMPLETA
                            </button>
                        </div>
                        <div>
                            <button className={`${styles.bttn}`} onClick={() => handleConfirm()}>CONFIRMAR</button>
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    );
}
