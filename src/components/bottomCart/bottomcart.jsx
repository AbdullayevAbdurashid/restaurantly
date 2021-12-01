import React, { useState, useContext } from 'react'
import 'react-spring-bottom-sheet/dist/style.css'
import { useCart } from "react-use-cart";
import { motion } from "framer-motion";
import "../check/check.css";
import axios from "axios";
import { Grid } from '@material-ui/core';
import CurrencyFormat from "react-currency-format";
import AddIcon from "@material-ui/icons/Add";
import { message } from "antd";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import { IpContext } from "../../context/ipProvider"


function Bottomcart({ opens: isOpen, func: foobar, }) {


    const [ip, socket] = useContext(IpContext)

    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

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

    ;
    //Refs and states
    const [anim, setAnim] = useState(0);
    const input = sessionStorage.getItem("table");


    //Tracking click of end order vutton
    const handleCLicker = () => {
        if (isEmpty === false) {
            if (input !== "null" || null) {
                setAnim(1600);
                setTimeout(function () {
                    afterEmtyping()
                }, 1000);
            } else {
                message.error("QR CODNI QAYTA SKANER QILING!");
            }
        }
    };
    const afterEmtyping = () => {
        socket.emit("post-order", {
            table: input,
            money: cartTotal,
            foods: items,
            time: new Date().getHours() + ":" + new Date().getMinutes()
        });
        axios({
            method: "post",
            url: `${ip}/status`,
            data: {
                date: date,
                money: cartTotal,
            },
        });
        emptyCart(); // runs first
        setAnim(0); // runs second
        message.success('Buyurtmangiz jonatildi');
        window.location.reload();

    }
    //Emty cart animation
    const cartEmpty = () => {
        setAnim(1600);
        setTimeout(function () {
            emptyCart(); // runs first
            window.location.reload();

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
            <SwipeableDrawer
                anchor="bottom"
                width={200}
                open={isOpen}
                onClose={onDismiss}
                disableBackdropTransition={!iOS} disableDiscovery={iOS}
            >
                <Container maxWidth="sm">

                    <div
                        initial={{ x: 360 }}
                        animate={{ x: 0 }}
                        transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
                        style={{ marginTop: "20px", padding: "10px" }}
                    >
                        <div style={{ display: "flex", top: 0, right: 0, }}>

                            <div style={{
                                display: "flex", flexDirection: "row",
                                width: "100%",
                                height: "30px",
                                marginLeft: "auto",
                                marginTop: "auto",
                                marginBottom: "5px",
                            }}>     <h3
                                className="text-2xl"
                                style={{
                                    color: "black",
                                }}>
                                    {" "}
                                    Summa:
                                    <CurrencyFormat
                                        value={cartTotal}
                                        displayType={"text"}
                                        suffix=" sum"
                                        thousandSeparator={true}
                                        renderText={(value) => (
                                            <span
                                                className="text-2xl"
                                                style={{ color: "#187CDF", }}>
                                                {value}
                                            </span>
                                        )}
                                    />
                                </h3>
                                <motion.div
                                    onClick={() => cartEmpty()}
                                    whileTap={{ scale: 1.1 }}
                                    style={{
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
                                            width: "100px",
                                            height: "35px",
                                            marginLeft: "auto",
                                            marginBottom: "0px",
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <Divider style={{ height: "2px" }} className="  bg-gray-900" />

                        <div className="mywrapperr" style={{ maxHeight: height, marginBottom: "70px" }}>
                            <div className="main" >
                                {items.map((item) => (
                                    <div key={item.id} className="itemMain">
                                        <motion.div
                                            variants={itemss}
                                            transition={{ duration: 0.5 }}
                                            initial={{ x: 460 }}
                                            animate={{ x: anim }}
                                            className="productts"
                                        >
                                            <Grid container spacing={1} >
                                                <Grid item xs={8} >

                                                    <div className="-mt-3">
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
                                                </Grid>
                                                <Grid item xs={4} >

                                                    <div className="gap-2 flex absolute float-left flex-row flex-wrap flex-none w-full mr-auto">
                                                        <span className="mb-auto">
                                                            <motion.button
                                                                className="pplus  h-8 w-8 "
                                                                onClick={() =>
                                                                    updateItemQuantity(item.id, item.quantity + 1)
                                                                }
                                                            >
                                                                <AddIcon />
                                                            </motion.button>
                                                        </span>
                                                        <span className="text-lg    -mt-1">
                                                            <p >{item.quantity}</p>
                                                        </span>
                                                        <span className="  mb-auto">
                                                            <motion.button
                                                                className="pplus  h-8 w-8"
                                                                whileTap={{ scale: 0.8 }}
                                                                onClick={() =>
                                                                    updateItemQuantity(item.id, item.quantity - 1)
                                                                }
                                                            >

                                                                <RemoveIcon />
                                                            </motion.button>
                                                        </span>
                                                    </div>
                                                </Grid>
                                            </Grid>

                                        </motion.div>
                                    </div>
                                ))}
                            </div>

                            {/* Button stuff */}
                            <div className='ml-20'>

                                <motion.button
                                    whileTap={{ scale: 1.1 }}
                                    className="pl fixed w-full center  m-auto"
                                    onClick={handleCLicker}
                                >
                                    Jonatish{" "}
                                </motion.button>




                            </div>

                        </div>

                    </div >
                </Container>

            </SwipeableDrawer>

        </div >
    )
}

export default Bottomcart
