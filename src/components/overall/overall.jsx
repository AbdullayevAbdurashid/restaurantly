import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Table } from "antd";
import { InputNumber } from "antd";
import Container from "@material-ui/core/Container";
import { motion } from "framer-motion";
import { Modal } from "antd";
import { Input } from "antd";

function Overall() {
  const socket = io("http://localhost:4000");
  const [data, setData] = useState([]);
  const [table, setsingleTable] = useState([false]);
  const [inputValue, setInputValue] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputValues, setInputValues] = useState("");
  const [isIncorrect, setIncorrect] = useState(false);
  const [anim, setAnim] = useState(0);

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    socket.on("recieve-order", (message) => {
      (async function () {
        const { data } = await axios.get("http://localhost:4000/orders");
        setData(data);
      })();
    });
    (async function () {
      const { data } = await axios.get("http://localhost:4000/orders");
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
            console.log(foodObj);
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
      }, 1000);
    } else {
      setIncorrect(true);
    }
  };
  console.log(inputValues);
  return (
    <Container maxWidth="lg">
      <div className="cheklist">
        <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <p style={{ fontSize: "16px" }}>Stol raqami:</p>
            <InputNumber
              placeholder="1"
              type="number"
              size="small"
              style={{ height: "25px", width: "50px" }}
              min="1"
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
                <p style={{ fontSize: "19px" }}>
                  Jami:{" "}
                  <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                    {obj.money}
                  </span>
                </p>
                <p style={{ fontSize: "19px" }}>
                  Usluga: {""}
                  <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                    10%
                  </span>
                </p>
              </div>
              <div>
                {" "}
                <p style={{ fontSize: "22px" }}>
                  Hammasi: {""}
                  <span style={{ fontWeight: "bold", color: "#FF3131" }}>
                    {Math.trunc(obj.money + (obj.money / 100) * 10)}
                  </span>
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
      </div>
    </Container>
  );
}

export default Overall;
