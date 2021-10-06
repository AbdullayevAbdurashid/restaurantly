import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

function Overall() {
  const socket = io("http://localhost:4000");
  const [data, setData] = useState([]);
  const [table, setsingleTable] = useState([]);
  const [inputValue, setInputValue] = useState(1);
  const [loading, setLoading] = useState(false);

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
            allOrders[foodObj.name] = foodObj.quantity;
          } else {
            allOrders[foodObj.name] =
              allOrders[foodObj.name] + foodObj.quantity;
          }
        });
        return acc;
      }, {});
    allOrders = Object.entries(allOrders).map(([key, value]) => {
      return { name: key, quantity: value };
    });
    allOrdersFromSingleTable.foods = allOrders;
    // allOrdersFromSingleTable is what u should print
    setsingleTable([allOrdersFromSingleTable]);
  }

  const deleteObj = (id) => {
    socket.emit("done-order", id);
  };
  return (
    <div className="cheklist">
      <button
        onClick={() => {
          filterTables();
        }}
      >
        Filter
      </button>
      <input
        type="number"
        onChange={(e) => setInputValue(parseInt(e.target.value))}
      />
      {table.map((obj, index) => (
        <div>
          {obj.foods.map((food, index) => (
            <div>
              <h4>{food.name}</h4>
            </div>
          ))}{" "}
          <h2>{obj.money}</h2>
          <button onClick={() => deleteObj(obj.table)}>Delete</button>
        </div>
      ))}
      {loading === true && <h1>loading...</h1>}
    </div>
  );
}

export default Overall;
