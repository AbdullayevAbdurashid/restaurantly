import React, { useState } from 'react'
import 'react-spring-bottom-sheet/dist/style.css'
import { BottomSheet } from "react-spring-bottom-sheet";
import { useCart } from "react-use-cart";
import { motion } from "framer-motion";
import "../check/check.css";
import axios from "axios";
import { io } from "socket.io-client";
import CurrencyFormat from "react-currency-format";
import AddIcon from "@material-ui/icons/Add";
import { message } from "antd";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "antd";
import Container from "@material-ui/core/Container";
function Bottomcart({ opens: isOpen, func: foobar }) {

    const {
        isEmpty,
        cartTotal,
        items,
        updateItemQuantity,
        emptyCart,
    } = useCart();
    function onDismiss() {
        foobar(false);
    }
    const socket = io("http://localhost:4000");

    const success = () => {
        message.success('Buyurtmangiz jonatildi');
    };
    //Refs and states
    const [anim, setAnim] = useState(0);
    const [input, setInput] = useState(0);


    //Sending data to server to orders page
    const setPosst = () => {
        socket.emit("post-order", {
            table: input,
            money: cartTotal,
            foods: items,
            time: new Date().getHours() + ":" + new Date().getMinutes()
        });
    };
    //Sending data to server to stats page

    const setPost = () => {
        axios({
            method: "post",
            url: "http://localhost:4000/status",
            data: {
                date: date,
                money: cartTotal,
            },
        });
    };
    //Tracking click of end order vutton
    const handleCLicker = () => {
        if (isEmpty === false) {
            if (input) {
                setAnim(1600);
                setTimeout(function () {
                    afterEmtyping()
                }, 1000);
            } else if (input === 0) {
                message.error("Stolni raqamini kiritng");
            }
        }
    };
    const afterEmtyping = () => {
        setPosst();
        setPost();
        emptyCart(); // runs first
        setAnim(0); // runs second
        success()
    }
    //Emty cart animation
    const cartEmpty = () => {
        setAnim(1600);
        setTimeout(function () {
            emptyCart(); // runs first
            setAnim(0); // runs second
        }, 1000);
    };
    //Framer motion stuff
    const itemss = {
        hidden: { opacity: 0 },
        show: { opacity: 1 },
    };
    const height = window.innerHeight - 325 + "px";
    //Taking date
    let newDate = new Date();
    let month = newDate.getMonth() + 1;
    let date = newDate.getDate() + "/" + month + "/" + newDate.getFullYear();

    return (
        <div>
            <BottomSheet
                open={isOpen}
                onDismiss={onDismiss}
                blocking={true}

                defaultSnap={({ maxHeight }) => maxHeight / 2}
                snapPoints={({ maxHeight }) => [
                    maxHeight - maxHeight / 10,
                    maxHeight / 4,
                    maxHeight * 0.6,
                ]}
                header={
                    <div style={{ display: "flex" }}>

                        <div style={{
                            display: "flex", flexDirection: "row",
                            width: "100%",
                            height: "30px",
                            marginLeft: "auto",
                            marginTop: "auto",
                            marginBottom: "5px",
                        }}>
                            <p style={{ fontSize: "24px", }}>Tanlangan ovqatlar</p>
                            <motion.div
                                onClick={() => cartEmpty()}
                                whileTap={{ scale: 1.1 }}
                                style={{
                                    fontSize: "14px",
                                    width: "80px",
                                    height: "30px",
                                    marginLeft: "auto",
                                    marginTop: "auto",
                                    marginBottom: "5px",
                                }}
                            >
                                <DeleteIcon
                                    style={{
                                        color: "#d60505",
                                        fontSize: "14px",
                                        width: "100px",
                                        height: "40px",
                                        marginLeft: "auto",
                                        marginBottom: "0px",
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>


                }
                footer={
                    <div>
                        <div className="par">

                            <div className='paragraph'>
                                <div className="table">
                                    <h1
                                        style={{
                                            margin: "auto",
                                            fontSize: "22px",
                                            paddingRight: "11px",
                                        }}
                                    >
                                        Stol raqami{" "}
                                    </h1>

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={input}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            margin: "auto",
                                            fontSize: "20px",
                                            borderRadius: "5px",
                                            boxShadow: " 2px 2px 5px 4px rgba(0, 0, 0, 0.25)",
                                            border: 0,
                                        }}
                                        onChange={(e) => setInput(e.target.value)}
                                    />
                                    <br />

                                </div>
                                <h3 style={{
                                    color: "black", fontSize: "24px", margin: "auto",
                                }}>
                                    {" "}
                                    Summa:
                                    <CurrencyFormat
                                        value={cartTotal}
                                        displayType={"text"}
                                        suffix=" sum"
                                        thousandSeparator={true}
                                        renderText={(value) => (
                                            <span style={{ color: "#187CDF", fontSize: "22px" }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </h3>
                            </div>
                            <motion.button
                                whileTap={{ scale: 1.1 }}
                                className="pl"
                                onClick={handleCLicker}
                            >
                                Jonatish{" "}
                            </motion.button>


                        </div>


                    </div>
                }
            >

                <Container>

                    <motion.div
                        initial={{ x: 360 }}
                        animate={{ x: 0 }}
                        transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
                        style={{ marginTop: "20px" }}
                    >
                        <motion.div className="mywrapperr" style={{ height: height }}>






                            <div className="main" style={{ height: height }}>
                                {items.map((item) => (
                                    <div key={item.id} className="itemMain">
                                        <motion.div
                                            variants={itemss}
                                            transition={{ duration: 0.5 }}
                                            initial={{ x: 460 }}
                                            animate={{ x: anim }}
                                            className="productts"
                                        >
                                            <div>
                                                <p className="firstName">{item.name}</p>

                                                <CurrencyFormat
                                                    value={item.price * item.quantity}
                                                    displayType={"text"}
                                                    suffix=" sum"
                                                    thousandSeparator={true}
                                                    renderText={(value) => (
                                                        <motion.p className="secondName"> {value} </motion.p>
                                                    )}
                                                />
                                            </div>
                                            <div className="productss">
                                                <motion.button
                                                    whileTap={{ scale: 1.1 }}
                                                    className="pplus"
                                                    onClick={() =>
                                                        updateItemQuantity(item.id, item.quantity + 1)
                                                    }
                                                >
                                                    <AddIcon fontSize="small" />
                                                </motion.button>
                                                <p className="quan">{item.quantity}</p>
                                                <motion.button
                                                    whileTap={{ scale: 1.1 }}
                                                    className="pplus"
                                                    onClick={() =>
                                                        updateItemQuantity(item.id, item.quantity - 1)
                                                    }
                                                >
                                                    <RemoveIcon fontSize="small" />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>

                            {/* Button stuff */}


                        </motion.div>

                    </motion.div >
                </Container>
            </BottomSheet>
        </div >
    )
}

export default Bottomcart
