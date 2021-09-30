import React, { useState } from 'react'
import { useCart } from "react-use-cart";
import { motion } from "framer-motion"
import Divider from '@material-ui/core/Divider';
import "./check.css"
import axios from 'axios';
import { io } from "socket.io-client";
import { ReactComponent as Trash } from './delete.svg';

function Check() {

    //connecting to socket
    const socket = io("http://localhost:4000");

    //Importing cart
    const {
        isEmpty,
        cartTotal,
        items,
        updateItemQuantity,
        emptyCart

    } = useCart();


    //Refs and states
    const textInput = React.useRef(null);
    const [anim, setAnim] = useState(0)
    const [input, setInput] = useState("")



    //Sending data to server to orders page
    const setPosst = () => {
        socket.emit("post-order", {
            table: input, money: cartTotal, foods: items

        })
    }
    //Sending data to server to stats page

    const setPost = () => {
        axios({
            method: 'post',
            url: 'http://localhost:4000/status',
            data: {
                date: date,
                money: cartTotal
            },
        });




    }

    //Tracking click of end order vutton
    const handleCLicker = () => {
        if (isEmpty === false) {
            if (input) {
                setAnim(1600)
                setTimeout(
                    function () {

                        setPosst()
                        setPost()
                        emptyCart() // runs first
                        setAnim(0) // runs second
                        textInput.current.value = "";
                    },
                    1000
                );
            } else {
                alert("Stolni raqamini kiritng")

            }
        }
    }

    //Emty cart animation
    const cartEmpty = () => {
        setAnim(1600)
        setTimeout(
            function () {
                emptyCart() // runs first
                setAnim(0) // runs second
            },
            1000
        );
    }

    //Framer motion stuff
    const itemss = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    }
    const height = window.innerHeight - 20 + "px"

    //Taking date
    let newDate = new Date()
    let date = newDate.getDate() + "/" + newDate.getMonth() + 1 + "/" + newDate.getFullYear().toString().substring(2)

    return (
        <motion.div initial={{ x: 160 }}
            animate={{ x: 0 }}
            transition={{ type: "tween", stiffness: 50, duration: 0.5 }} style={{ marginTop: "20px" }}
        >


            <motion.div
                className="mywrapperr"
                style={{ height: height }}
            >
                <div style={{ display: "flex" }}>
                    <p style={{ fontSize: "24px", marginBottom: '0px' }}> Check list </p>
                    <div onClick={() => cartEmpty()} style={{ fontSize: "14px", width: "80px", height: "30px", marginLeft: "auto", marginTop: 'auto', marginBottom: "5px" }} > <Trash style={{ fontSize: "14px", width: "80px", height: "30px", marginLeft: "auto", marginBottom: '0px' }} /> </div>

                </div>

                <Divider style={{ background: "blue" }} />

                <div className="main">
                    {items.map((item) => (


                        <div key={item.id} className="" >
                            <motion.div
                                variants={itemss}
                                transition={{ duration: 0.5 }}

                                initial={{ x: 460 }}
                                animate={{ x: anim }}
                                className='productts'>

                                <div><p className="firstName">{item.name}</p>
                                    <motion.p className="secondName"


                                    >{item.price * item.quantity} </motion.p>
                                </div>
                                <div className="productss">

                                    <motion.button
                                        whileTap={{ scale: 1.1 }}
                                        className="plus"
                                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                    >+ </motion.button>
                                    <p className="quan">{item.quantity}</p>
                                    <motion.button
                                        whileTap={{ scale: 1.1 }}
                                        className="pluss"
                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                    >- </motion.button>

                                </div>
                            </motion.div>

                        </div>

                    ))}
                </div>



                {/* Button stuff */}
                <div className="table">
                    <p style={{ margin: "auto", fontSize: "24px", paddingRight: "30px" }}> Stol raqami </p>
                    <input type="number"
                        min="0" max="100"
                        ref={textInput}
                        style={{ width: "55px", height: "25px", margin: "auto", fontSize: "24px", borderRadius: "5px", boxShadow: " 2px 2px 5px 4px rgba(0, 0, 0, 0.25)", border: 0, }}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <br />

                </div>
                <div className="p">
                    <h3 style={{ color: "black", fontSize: "24px" }}> Jami: <span style={{ color: "#187CDF", fontSize: "24px" }}>{cartTotal} sum</span></h3>
                    <motion.button
                        whileTap={{ scale: 1.1 }}
                        className="pl"
                        onClick={() => handleCLicker()}
                    >Jonatish  </motion.button>
                </div>
            </motion.div>
        </motion.div >
    )
}

export default Check

