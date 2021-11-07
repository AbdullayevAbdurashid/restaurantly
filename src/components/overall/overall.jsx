import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { motion } from "framer-motion";
import { Modal, Input, Table, InputNumber } from "antd";
import CurrencyFormat from "react-currency-format";
import { Link } from "react-router-dom";
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { isMobile } from "react-device-detect";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";

import { useHistory } from "react-router-dom";
const useStyles = makeStyles({
  stickToBottom: {
    zIndex: "2",
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  root: {
    width: 500,
  },
});

function Overall() {
  let history = useHistory();
  const classes = useStyles();

  const socket = io("http://192.168.43.2:4000");
  const [service, setService] = useState([]);
  const [data, setData] = useState([]);
  const [table, setsingleTable] = useState([false]);
  const [inputValue, setInputValue] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValues, setInputValues] = useState("");
  const [isIncorrect, setIncorrect] = useState(false);
  const [anim, setAnim] = useState(0);
  const [value, setValue] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    socket.on("recieve-order", (message) => {
      (async function () {
        const { data } = await axios.get("http://192.168.43.2:4000/orders");
        setData(data);
      })();
    });
    (async function () {
      const { data } = await axios.get("http://192.168.43.2:4000/orders");
      const { data: servicee } = await axios.get(
        "http://192.168.43.2:4000/service"
      );
      setService(servicee);
      setData(data);
    })();
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Narxi",
      dataIndex: "price",
      key: "price",
      render: (value) => (
        <p>
          {" "}
          <CurrencyFormat
            value={value}
            displayType={"text"}
            suffix=" sum"
            thousandSeparator={true}
            renderText={(value) => <p className="">{value} </p>}
          />
        </p>
      ),
    },
    {
      title: "Soni",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Summa",
      dataIndex: "allprice",
      key: "allPrice",
      render: (value) => (
        <p>
          {" "}
          <CurrencyFormat
            value={value}
            displayType={"text"}
            suffix=" sum"
            thousandSeparator={true}
            renderText={(value) => (
              <p style={{ color: "#187CDF", fontWeight: "bold" }}>{value} </p>
            )}
          />
        </p>
      ),
    },
  ];

  function filterTables() {
    let allOrders = {};
    let allOrdersFromSingleTable = data
      .filter((obj) => obj.table === inputValue)
      .reduce((acc, obj) => {
        acc.table = obj.table;
        acc.foods = [];

        acc.id = obj._id;
        if (!acc.money) {
          acc.money = obj.money;
        } else {
          acc.money = acc.money + obj.money;
        }

        obj.foods.forEach((foodObj) => {
          if (!allOrders[foodObj.name]) {
            allOrders[foodObj.name] = {
              q: foodObj.quantity,
              price: foodObj.price,
              allPrice: foodObj.price * foodObj.quantity,
            };
          } else {
            allOrders[foodObj.name] =
              allOrders[foodObj.name.q] + foodObj.quantity;
            allOrders[foodObj.name] =
              allOrders[foodObj.name.price] + foodObj.price;
            allOrders[foodObj.name] =
              allOrders[foodObj.name.allpPrice] +
              foodObj.price * foodObj.quantity;
          }
        });
        return acc;
      }, {});
    allOrders = Object.entries(allOrders).map(([key, value]) => {
      return {
        name: key,
        quantity: value.q,
        price: value.price,
        allprice: value.allPrice,
      };
    });
    allOrdersFromSingleTable.foods = allOrders;
    // allOrdersFromSingleTable is what u should print
    setsingleTable([allOrdersFromSingleTable]);
  }

  const password = "admin2020";
  const deleteObj = (id) => {
    if (inputValues === password) {
      socket.emit("done-order", id);
      setIsModalVisible(false);

      setTimeout(() => {
        setAnim(1800);
        window.location.reload(true);

      }, 1000);
    } else {
      setIncorrect(true);
    }
  };
  return (
    <Container>
      <motion.div className="cheklist"
        initial={{ y: -900 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >

        <Link to="/">
          <motion.button
            whileTap={{ scale: 1.1 }}
            className="filterButton"
            style={{
              marginLeft: "-140px",
              height: "35px",
              transform: "none",
              texAlign: "center",
            }}
          >
            <ArrowBackOutlinedIcon />
          </motion.button>          </Link>
        <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>

          <div style={{ display: "flex", gap: "10px" }}>
            <p style={{ fontSize: "16px" }}>Stol raqami: </p>
            <InputNumber
              placeholder="1"
              type="number"
              size="small"
              style={{ height: "25px", width: "50px" }}
              min="0"
              max="100"
              onChange={(e) => setInputValue(parseInt(e))}
            />
          </div>
          <motion.button
            whileTap={{ scale: 1.1 }}
            className="filterButton"
            onClick={() => {
              filterTables();
              setAnim(0);
            }}
          >
            Izlash
          </motion.button>
        </div>
        {table.map((obj, index) => (
          <div>
            <motion.div initial={{ x: 0 }} animate={{ x: anim }}>
              <Table size="middle" columns={columns} dataSource={obj.foods} />
            </motion.div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <div style={{ display: "flex", gap: "20px" }}>
                {" "}
                <CurrencyFormat
                  value={obj.money}
                  displayType={"text"}
                  suffix=" sum"
                  thousandSeparator={true}
                  renderText={(value) => (
                    <p style={{ fontSize: "19px" }}>
                      Jami: {" "}
                      <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                        {value}
                      </span>
                    </p>
                  )}
                />
                <p style={{ fontSize: "19px" }}>
                  Usluga: {""}
                  <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                    {service}%
                  </span>
                </p>
              </div>
              <div>
                {" "}
                <p style={{ fontSize: "22px" }}>
                  Hammasi: {""}
                  <CurrencyFormat
                    value={Math.trunc(obj.money + (obj.money / 100) * service)}
                    displayType={"text"}
                    suffix=" sum"
                    thousandSeparator={true}
                    renderText={(value) => (
                      <span style={{ fontWeight: "bold", color: "#FF3131" }}>
                        {value}
                      </span>
                    )}
                  />
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 1.1 }}
              className="pl"
              style={{ marginTop: "60px" }}
              onClick={showModal}
            >
              Pul tolandi
            </motion.button>
            <Modal
              title="Parol"
              onOk={() => deleteObj(obj.table)}
              onCancel={() => setIsModalVisible(false)}
              okText="Tasdiqlash"
              cancelText="Orqaga"
              visible={isModalVisible}
              height={100}
            >
              <p>Parolni Kiriting</p>

              {isIncorrect ? (
                <h4 className="errorInput" style={{ color: "red" }}>
                  Parol Notogri{" "}
                </h4>
              ) : null}

              <Input.Password
                style={{ width: "300px" }}
                onChange={(e) => setInputValues(e.target.value)}
                placeholder="Parolni kiritng"
              />
            </Modal>
          </div>
        ))}
      </motion.div>

      {isMobile ? (
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
          className={classes.stickToBottom}
        >
          <BottomNavigationAction label="Asosiy"
            onClick={() => history.push("/")}

            icon={<HomeIcon />} />
        </BottomNavigation>
      ) : null}
    </Container >

  );
}

export default Overall;
