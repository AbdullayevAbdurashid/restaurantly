import React, { useState } from "react";
import { useCart } from "react-use-cart";
import { motion } from "framer-motion";
import Divider from "@material-ui/core/Divider";
import "./check.css";
import axios from "axios";
import { io } from "socket.io-client";
import CurrencyFormat from "react-currency-format";
import AddIcon from "@material-ui/icons/Add";
import { Drawer, Button } from "antd";
import ArrowBackIosOutlinedIcon from "@material-ui/icons/ArrowBackIosOutlined";
import RemoveIcon from "@material-ui/icons/Remove";
import DeleteIcon from "@material-ui/icons/Delete";
import { Modal, Space } from "antd";

function Check() {
  //connecting to socket
  const socket = io("http://localhost:4000");

  //Importing cart
  const {
    isEmpty,
    cartTotal,
    items,
    updateItemQuantity,
    emptyCart,
    totalItems,
  } = useCart();

  //Refs and states
  const [anim, setAnim] = useState(0);
  const [input, setInput] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  //Sending data to server to orders page
  const setPosst = () => {
    socket.emit("post-order", {
      table: input,
      money: cartTotal,
      foods: items,
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
          setPosst();
          setPost();
          emptyCart(); // runs first
          setAnim(0); // runs second
          setInput(0);
          setIsModalVisible(false);
        }, 1000);
      } else if (input === 0) {
        alert("Stolni raqamini kiritng");
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
  const height = window.innerHeight - 105 + "px";

  //Taking date
  let newDate = new Date();
  let month = newDate.getMonth() + 1;
  let date = newDate.getDate() + "/" + 1 + "/" + newDate.getFullYear();
  return (
    <motion.div
      initial={{ x: 160 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
      style={{ marginTop: "20px" }}
    >
      <Button
        onClick={showDrawer}
        style={{ position: "absolute", top: "50%", right: "0" }}
        type="default"
        icon={<ArrowBackIosOutlinedIcon />}
      >
        <h4 style={{ color: "#1948f0" }}>{totalItems} items</h4>
      </Button>
      <Drawer
        width={400}
        title="Check"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <motion.div className="mywrapperr" style={{ height: height }}>
          <div style={{ display: "flex" }}>
            <p style={{ fontSize: "24px", marginBottom: "0px" }}> Products </p>
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
                  width: "80px",
                  height: "30px",
                  marginLeft: "auto",
                  marginBottom: "0px",
                }}
              />
            </motion.div>
          </div>

          <Divider style={{ background: "blue" }} />

          <div className="main">
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
          <div className="table">
            <p
              style={{ margin: "auto", fontSize: "24px", paddingRight: "30px" }}
            >
              {" "}
              Stol raqami{" "}
            </p>
            <input
              type="number"
              min="0"
              max="100"
              value={input}
              style={{
                width: "55px",
                height: "25px",
                margin: "auto",
                fontSize: "24px",
                borderRadius: "5px",
                boxShadow: " 2px 2px 5px 4px rgba(0, 0, 0, 0.25)",
                border: 0,
              }}
              onChange={(e) => setInput(e.target.value)}
            />
            <br />
          </div>
          <div className="p">
            <h3 style={{ color: "black", fontSize: "20px" }}>
              {" "}
              Jami:
              <CurrencyFormat
                value={cartTotal}
                displayType={"text"}
                suffix=" sum"
                thousandSeparator={true}
                renderText={(value) => (
                  <span style={{ color: "#187CDF", fontSize: "24px" }}>
                    {value}
                  </span>
                )}
              />
            </h3>
            <motion.button
              whileTap={{ scale: 1.1 }}
              className="pl"
              onClick={showModal}
            >
              Jonatish{" "}
            </motion.button>
          </div>
        </motion.div>
      </Drawer>
      <Modal
        title="Сonfirm"
        onOk={handleCLicker}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes"
        cancelText="No"
        visible={isModalVisible}
        height={100}
      >
        <p>Do you confirm?</p>
      </Modal>
    </motion.div>
  );
}

export default Check;
