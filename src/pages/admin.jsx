//IMPORTANT
import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router";
import axios from "axios";
import CurrencyFormat from "react-currency-format";

//UI
import Container from "@material-ui/core/Container";
import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Modal, Table, InputNumber, Popconfirm } from "antd";
import { IpContext } from "../context/ipProvider";
import { motion } from "framer-motion";

function Admin() {

 const TableNumber =  sessionStorage.getItem("tableNum")

  const [ip, socket] = useContext(IpContext);
  //App states i know it is a lot
  const [service, setService] = useState([]);
  const [data, setData] = useState([]);
  const [table, setsingleTable] = useState([false]);
  const [inputValue, setInputValue] = useState({});

  const [isModalVisible, setIsModalVisible] = useState({
    modal: false,
    alert: false,
    promise: false,
    popconfirm: false,
  });
  const [inputValues, setInputValues] = useState(parseInt(TableNumber));
  const [value, setValue] = useState();
  const [reduce, setReduce] = useState({ tableNum: inputValue, pr: [] });


  const HideModal = () => {
    setReduce({ tableNum: inputValues, pr: [] });
    setIsModalVisible({ modal: false });
  };



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
      const { data: servicee } = await axios.get(`${ip}/service`);
      setService(servicee);
      setData(data);
    })();
  }, []);
  if (localStorage.getItem("details") === "false" || !localStorage.getItem("details"))
  return (
      <Redirect to="/login" />
  );
  //table columns array
  const columns = [
    {
      title: "Названия",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Стоимость",
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
      title: "Кол-во  ",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Сумма",
      dataIndex: "allprice",
      key: "allPrice",
      render: (value) => (
        <p>
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
    {
      title: "Удалить",
      dataIndex: ["name", "allprice"],
      key: "delete",
      render: (text, record) => (
        <div>
          <InputNumber
            placeholder={1}
            defaultValue={0}
            type="number"
            size="small"
            style={{ height: "25px", width: "35px" }}
            min="1"
            max={record.quantity}
            onChange={(e) =>
              setValue((prevState) => ({
                ...prevState,
                [record.id]: e,
              }))
            }
            
          />
          <IconButton onClick={() => deleteItems(record)}>
            <Delete fontSize="medium" />
          </IconButton>
        </div>
      ),
    },
  ];
  function removeFoods() {
    axios
      .post(`${ip}/reduce`, reduce)
      .then(window.location.reload());
  }
  //Deleting items and sending to server
  function deleteItems(records) {
    if (value) {
      setReduce((prevState) => ({
        tableNum: inputValues,
        pr: [
          ...prevState.pr,
          {  name: records.name, quantity: value[records.id] },
        ],
      }));
      setIsModalVisible({ modal: true });
    }
  }
console.log(reduce)
  //Function activated when clicked on button to filter according to table
  function filterTables() {
    let allOrders = {};
    let allOrdersFromSingleTable = data
      .filter((obj) => {
        return obj.table === inputValues;
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
        id: value.id,
      };
    });
    allOrdersFromSingleTable.foods = allOrders;
    // allOrdersFromSingleTable is what u should print
    setsingleTable([allOrdersFromSingleTable]);
  
  }

  //End order button action

  const DeleteOrder = (id) => {
    setIsModalVisible({ promise: true });
    socket.emit("done-order", id);
    PostStatus();
    setTimeout(() => {
      setIsModalVisible({ promise: false });
      window.location.reload();
    }, 1000);
  };
  const ChangeInput = (e) => {
    setInputValues(parseInt(e));
    sessionStorage.setItem("tableNum", e);
    };

  const PostStatus = () => {
    //Taking date
    let newDate = new Date();
    let month = newDate.getMonth() + 1;
    let date = newDate.getDate() + "/" + month + "/" + newDate.getFullYear();
    axios({
      method: "post",
      url: `${ip}/status`,
      data: {
        date: date,
        money: table[0].money + (table[0].money / 100) * service,
      },
    });
  };
  
  return (
    <div>
      <Container maxWidth="sm">
        <motion.div
          className="cheklist"
          initial={{ y: -900 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: "20px", width: "100%", display: "flex" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <p style={{ fontSize: "16px" }}>Стол: </p>
              <InputNumber
                placeholder={inputValues}
                defaultValue={inputValues}
                type="number"
                size="small"
                style={{ height: "25px", width: "50px" }}
                min="0"
                max="500  "
                onChange={(e) => ChangeInput(parseInt(e))}
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
              <div>
                <Table size="middle" columns={columns} dataSource={obj.foods} />
              </div>
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
                        Всего:{" "}
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
                      value={Math.trunc(
                        obj.money + (obj.money / 100) * service
                      )}
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
              <center>
                <Popconfirm
                  title="Подтверждения"
                  visible={isModalVisible.popconfirm}
                  onConfirm={() => DeleteOrder(obj.table)}
                  okButtonProps={{ loading: isModalVisible.promise }}
                  onCancel={() => setIsModalVisible({ popconfirm: false })}
                >
                  <motion.button
                    whileTap={{ scale: 1.1 }}
                    className="pl w-10/12 m-auto"
                    style={{ marginTop: "60px" }}
                    onClick={() => setIsModalVisible({ popconfirm: true })}
                  >
                    Оплаченно
                  </motion.button>
                </Popconfirm>
              </center>
              <Modal
                title="Подтверждения"
                onOk={removeFoods}
                onCancel={HideModal}
                okText="Подтвердить"
                cancelText="Назад"
                visible={isModalVisible.modal}
                height={100}
              >
                <p>Выбранные заказы будут удалены, продолжить?</p>
              </Modal>
            </div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}

export default Admin;
