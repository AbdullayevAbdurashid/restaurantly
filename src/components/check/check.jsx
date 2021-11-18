import React, { useState } from "react";
import { useCart } from "react-use-cart";
import { motion } from "framer-motion";
import Divider from "@material-ui/core/Divider";
import "./check.css";
import axios from "axios";
import { io } from "socket.io-client";
import CurrencyFormat from "react-currency-format";
import AddIcon from "@material-ui/icons/Add";
import { Button } from "antd";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal } from "antd";
import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { message } from "antd";

const socket = io("http://192.168.1.2:4000");
function Check() {
  const {
    isEmpty,
    cartTotal,
    items,
    updateItemQuantity,
    emptyCart,
  } = useCart();

  //Refs and states
  const [anim, setAnim] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const input = sessionStorage.getItem("table");

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
      url: "http://192.168.1.2:4000/status",
      data: {
        date: date,
        money: cartTotal,
      },
    });
  };
  //Tracking click of end order vutton
  const handleCLicker = () => {
    if (isEmpty === false) {
      if (input !== "null" || null) {
        setAnim(1600);
        setTimeout(function () {
          setPosst();
          setPost();
          emptyCart(); // runs first
          setAnim(0); // runs second
          setIsModalVisible(false);
        }, 1000);
      } else {
        message.error("QR CODNI QAYTA SKANER QILISNG");
      }
    }
  };
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
  const height = window.innerHeight - 255 + "px";

  //Taking date
  let newDate = new Date();
  let month = newDate.getMonth() + 1;
  let date = newDate.getDate() + "/" + month + "/" + newDate.getFullYear();
  return (
    <Container style={{ width: '70%' }}>

      <motion.div
        initial={{ x: 360 }}
        animate={{ x: 0 }}
        transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
        style={{ marginTop: "6px" }
        }
      >
        <motion.div className="mywrapperr" style={{ height: height }}>
          <div style={{ display: "flex" }}>

            <p style={{ fontSize: "22px", marginBottom: "0px", margin: "0px auto", }}>Chek:</p>
            <Link to="/check">

              <Button type="dashed" shape="" icon={<PlaylistAddCheckOutlinedIcon />} >
              </Button>
            </Link>

            <div style={{
              display: "flex", flexDirection: "column",
              width: "80px",
              height: "30px",
              marginLeft: "auto",
              marginTop: "auto",
              marginBottom: "5px",
            }}>


            </div>
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

          <Divider style={{ background: "blue" }} />

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
                      whileTap={{ scale: 2.1 }}
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

          <div className="p">
            <div className='p'>
              <h3 style={{
                color: "black", fontSize: "24px", margin: "auto",
              }}>
                {" "}
                Jami:
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
              onClick={showModal}
            >
              Jonatish{" "}
            </motion.button>
          </div>
        </motion.div>
        <Modal
          title="Tasdiqlash"
          onOk={handleCLicker}
          onCancel={() => setIsModalVisible(false)}
          okText="Ha"
          cancelText="Yoq"
          visible={isModalVisible}
          height={100}
        >
          <p>Tasdiqlaysizmi?</p>
        </Modal>
      </motion.div >
    </Container >

  );
}

export default Check;
