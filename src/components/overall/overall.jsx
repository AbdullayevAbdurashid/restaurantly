import React, { useState, useEffect, useContext } from "react";



import axios from "axios";
import Container from "@material-ui/core/Container";
import { motion } from "framer-motion";
import {Table, InputNumber } from "antd";
import CurrencyFormat from "react-currency-format";
import { Link } from "react-router-dom";
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import { isMobile } from "react-device-detect";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { IpContext } from "../../context/ipProvider"


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

  const [ip, socket] = useContext(IpContext)



  //Router stuff
  let history = useHistory();
  const classes = useStyles();
  const input = sessionStorage.getItem("table");


  //States 
  const [service, setService] = useState([]);
  const [data, setData] = useState([]);
  const [table, setsingleTable] = useState([false]);
  const [inputValue, setInputValue] = useState(parseInt(input));
  
  const [value, setValue] = useState();

  //Getting order list when page loaded
  useEffect(() => {
    socket.on("recieve-order", (message) => {
      (async function () {
        const { data } = await axios.get(`${ip}/orders`);
        setData(data);
      })();
    });
    (async function () {
      const { data } = await axios.get(`${ip}/orders`);
      const { data: servicee } = await axios.get(
        `${ip}/service`
      );
      setService(servicee);
      setData(data);
      if (data) {
        let allOrders = {};
        let allOrdersFromSingleTable = data
          .filter((obj) => {
            return obj.table === inputValue
          })
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
                allOrders[foodObj.name].q =
                  allOrders[foodObj.name].q + foodObj.quantity;
                allOrders[foodObj.name].price =
                  allOrders[foodObj.name].price + foodObj.price;
                allOrders[foodObj.name].allpPrice =
                  allOrders[foodObj.name].allpPrice +
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
    })();
  }, []);


  //table columns array
  const columns = [
    {
      title: "Названия",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Цена",
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
      title: "Кол-во",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Сумма",
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
  //Function activated when clicked on button
  function filterTables() {
    let allOrders = {};
    let allOrdersFromSingleTable = data
      .filter((obj) => {
        return obj.table === inputValue
      })
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
              id: foodObj._id,

              price: foodObj.price,
              allPrice: foodObj.price * foodObj.quantity,
            };
          } else {
            allOrders[foodObj.name].q =
              allOrders[foodObj.name].q + foodObj.quantity;
            allOrders[foodObj.name].id =
              allOrders[foodObj.name].id + foodObj.quantity;
            allOrders[foodObj.name].price =
              allOrders[foodObj.name].price + foodObj.price;
            allOrders[foodObj.name].allpPrice =
              allOrders[foodObj.name].allpPrice +
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
        id: value.id
      };
    });
    allOrdersFromSingleTable.foods = allOrders;
    // allOrdersFromSingleTable is what u should print
    setsingleTable([allOrdersFromSingleTable]);
  }
  return (
    <div>
      <Container maxWidth="sm">
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
                placeholder={input}
                defaultValue={input}
                type="number"
                size="small"
                style={{ height: "25px", width: "50px" }}
                min="0"
                max="500  "
                onChange={(e) => setInputValue(parseInt(e))}
              />
            </div>
            <motion.button
              whileTap={{ scale: 1.1 }}
              className="filterButton"
              onClick={() => {
                filterTables();
          
              }}
            >
              Поиск
            </motion.button>
          </div>
          {table.map((obj, index) => (
            <div>
              <motion.div initial={{ x: 0 }}>
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
                        Всего: {" "}
                        <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                          {value}
                        </span>
                      </p>
                    )}
                  />
                  <p style={{ fontSize: "19px" }}>
                    Услуга: {""}
                    <span style={{ fontWeight: "bold", color: "#187CDF" }}>
                      {service}%
                    </span>
                  </p>
                </div>
                <div>
                  {" "}
                  <p style={{ fontSize: "22px" }}>
                    С услогой: {""}
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
           
              
            </div>
          ))}
        </motion.div>


      </Container >
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
    </div>

  );
}

export default Overall;
