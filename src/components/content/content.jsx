import React from "react";
import { motion } from "framer-motion";
import Divider from "@material-ui/core/Divider";
import { useEffect, useState } from "react";
import "antd/dist/antd.css";
import AddIcon from "@material-ui/icons/Add";
import Skeleton from "@material-ui/lab/Skeleton";
import { Radio } from "antd";
import placeholder from "./placeholder.png";
import "./content.css";
import { useCart } from "react-use-cart";
import CurrencyFormat from "react-currency-format";
import { Image } from "antd";

// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Radio from "@material-ui/core/Radio";
// import RadioGroup from "@material-ui/core/RadioGroup";
function Content({ data, loading }) {
  //TODO
  //ADD A  SKELETON
  //ADD A SEARCH

  const [quality, setQuality] = useState("1");
  const [pricer, setPrice] = useState("obj.price");
  const { addItem } = useCart();
  const height = window.innerHeight - 20 + "px";
  let keys = Object.keys(data);

  const addCart = (obj) => {
    addItem(obj);
  };

  const handleChange = (e, quality) => {
    setPrice(e.target.value);
    setQuality(quality);
  };

  //   if (error === true)
  //     return <p>Server is not working try to refresh the page</p>;
  return (
    <motion.div
      initial={{ x: -660 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        marginLeft: "70px",
        flexWrap: "wrap",
        overflow: "hidden",
      }}
    >
      {keys &&
        keys.map((key, indx) => (
          <div>
            <div key={indx} style={{ maxHeight: height }} className="mywrapper">
              <p className="cotegory">{key}</p>

              <Divider style={{ background: "blue" }} />
              {data &&
                data[key].map(({ _id: id, ...obj }) => (
                  <div>
                    <motion.div key={obj.id} className="products">
                      <Image
                        style={{ borderRadius: "15px" }}
                        width={77}
                        height={55}
                        src={
                          obj.productImage === null
                            ? "http://localhost:4000/" + obj.productImage
                            : placeholder
                        }
                      />

                      <div>
                        <p className="firstName">{obj.name}</p>
                        <CurrencyFormat
                          value={obj.price}
                          displayType={"text"}
                          suffix=" sum"
                          thousandSeparator={true}
                          renderText={(value) => (
                            <p className="secondName">{value} </p>
                          )}
                        />
                        <Radio.Group defaultValue="obj.price" size="small">
                          <Radio.Button
                            onClick={(e) => handleChange(e, "1")}
                            value="obj.price"
                          >
                            1.0
                          </Radio.Button>
                          <Radio.Button
                            disabled={obj.price05 ? false : true}
                            onClick={(e) => handleChange(e, "0.5")}
                            value="obj.price05"
                          >
                            0.5
                          </Radio.Button>
                          <Radio.Button
                            onClick={(e) => handleChange(e, "0.7")}
                            value="obj.price07"
                          >
                            0.7
                          </Radio.Button>
                        </Radio.Group>
                        {/* <motion.button
                          className="quality"
                          whileTap={{ scale: 1.1 }}
                          onClick={() => {
                            setQuality("1");
                          }}
                        >
                          1
                        </motion.button>
                        <motion.button
                          className="quality"
                          whileTap={{ scale: 1.1 }}
                          onClick={(e) => {
                            setQuality("0.5");
                          }}
                        >
                          0.5
                        </motion.button>
                        <motion.button
                          className="quality"
                          whileTap={{ scale: 1.1 }}
                          onClick={() => {
                            setQuality("0.7");
                          }}
                        >
                          0.7
                        </motion.button> */}
                      </div>

                      <motion.button
                        whileTap={{ scale: 1.1 }}
                        className="pplus"
                        onClick={() => {
                          let price = eval(pricer);
                          let tempObj = {
                            id: id + "quality" + quality,
                            quality: quality,
                            name: obj.name + " " + quality,
                            price: price,
                          };
                          addCart(tempObj);
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </motion.button>
                    </motion.div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      {loading === true && (
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <div style={{ width: "200px", marginTop: "10px" }}>
              <Skeleton
                height={40}
                style={{ marginBottom: -10, width: "100%" }}
              />

              <Skeleton
                animation="wave"
                height={100}
                style={{ marginBottom: -10 }}
              />
              <div style={{ display: "flex", gap: "20px" }}>
                <Skeleton style={{ marginBottom: 10, width: "20%" }} />
                <Skeleton style={{ marginBottom: 10, width: "20%" }} />
                <Skeleton style={{ marginBottom: 10, width: "20%" }} />
              </div>
              <Skeleton
                animation="wave"
                height={20}
                style={{
                  marginBottom: 10,
                  marginTop: -10,
                  width: "70%",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Content;
