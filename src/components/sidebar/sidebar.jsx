import React from 'react';
import Card from "../card/card"
import "./sidebar.css"
import { useCart } from "react-use-cart";
import { motion } from "framer-motion"

function ResponsiveDrawer() {

    const { emptyCart } = useCart();
    const clicker = () => {

        emptyCart()


    };


    const height = window.innerHeight + "px"
    return (

        <motion.div
            initial={{ x: -160 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.2, type: "tween", stiffness: 50, duration: 0.5 }}
            style={{ height: height }}
            className="sidebar" >
            {
                ['1', '2', '3', '4', '5', '6', '7', '8'].map((text, index) => (

                    <div className="list-item" onClick={() => {
                        localStorage.setItem('id', index);
                        clicker()
                    }} key={index}>
                        <Card name={text} colorIndex={index} />
                    </div>
                ))
            }

        </motion.div >
    );
}


export default ResponsiveDrawer;
