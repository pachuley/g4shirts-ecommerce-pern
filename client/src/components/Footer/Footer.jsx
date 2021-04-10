import React from 'react'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <div className={`${styles.container}`}>
            <div>
                <ul className={`${styles.list1}`}>
                    <li><i className="fas fa-map-marker-alt"></i> Av. Libertador 3529</li>
                    <li><i className="fab fa-whatsapp"></i> 11 3444 9288</li>
                    <li><i className="far fa-envelope"></i> support@4gshirts.com</li>
                </ul>
            </div>

            <div>
                <ul className={`${styles.list2}`}>
                    <li>Sobre G4 Shirts</li>
                    <li>
                        Somos una empresa de indumentaria que se encarga
                        de mantener el máximo nivel de calidad y de comodidad
                        de cada uno de nuestros productos.
                    </li>
                </ul>

            </div>
        </div>
    )
}
