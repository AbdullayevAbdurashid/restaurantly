import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import "antd/dist/antd.css";
import AddIcon from "@material-ui/icons/Add";
import Skeleton from "@material-ui/lab/Skeleton";
import { Radio } from "antd";
import placeholder from "./placeholder.png";
import "./content.css";
import { useCart } from "react-use-cart";
import Grid from '@material-ui/core/Grid';
import CurrencyFormat from "react-currency-format";
import { Image, Tabs } from "antd";

function Content({ data, loading }) {

  const { TabPane } = Tabs;
  const [open, setOpen] = useState(false)

  const [quality, setQuality] = useState({});
  const [pricer, setPrice] = useState({});
  const { addItem } = useCart();
  const height = window.innerHeight - 55 + "px";
  let keys = Object.keys(data);

  const addCart = (obj) => {
    addItem(obj);
  };

  const handleChange = (e, quality, id) => {
    setPrice({ ...pricer, [id]: e.target.value });
    setQuality({ ...quality, [id]: quality });
  };
  return (

    <motion.div
      initial={{ x: -660 }}
      animate={{ x: 0 }}
      transition={{ type: "tween", stiffness: 50, duration: 0.5 }}
      style={{
        display: "flex",
        gap: "20px",
        marginTop: "5px",
        marginLeft: "10px",
        flexWrap: "wrap",
        overflow: "hidden",
      }}
    >


      <Tabs tabPosition={"top"} size={"small"}>


        {keys &&
          keys.map((key, indx) => (
            <TabPane style={{ width: 1200 }} tab={key} key={indx}>
              <div>

                <div key={indx} style={{ height: height }} className="mywrapper" >
                  <Grid container spacing={2}  >

                    {data &&
                      data[key].map(({ _id: id, ...obj }, index) => (
                        <Grid item xs={12} sm={12} md={6} lg={4}>
                          <div>


                            <motion.div key={obj.id} className="products">
                              <Image
                                style={{ borderRadius: "15px", marginTop: "10px" }}
                                width={87}
                                height={65}
                                src={
                                  obj.productImage === "null" || !obj.productImage
                                    ? placeholder
                                    : "http://localhost:4000/" + obj.productImage
                                }
                              />

                              <div>
                                <p className="firstName">{obj.name}</p>
                                <CurrencyFormat
                                  value={pricer[id] ? eval(pricer[id]) : obj.price}
                                  displayType={"text"}
                                  suffix=" sum"
                                  thousandSeparator={true}
                                  renderText={(value) => (
                                    <p className="secondName ">{value} </p>
                                  )}
                                />
                                <Radio.Group defaultValue="obj.price" size="medium">
                                  <Radio.Button
                                    onClick={(e) => handleChange(e, "1", id)}
                                    disabled={obj.price ? false : true}
                                    value="obj.price"
                                  >
                                    1.0
                                  </Radio.Button>
                                  <Radio.Button
                                    disabled={obj.price05 ? false : true}
                                    onClick={(e) => handleChange(e, "0.5", id)}
                                    value="obj.price05"
                                  >
                                    0.5
                                  </Radio.Button>
                                  <Radio.Button
                                    disabled={obj.price07 ? false : true}
                                    onClick={(e) => handleChange(e, "0.7", id)}
                                    value="obj.price07"
                                  >
                                    0.7
                                  </Radio.Button>
                                </Radio.Group>
                              </div>

                              <motion.button
                                whileTap={{ scale: 1.1 }}
                                className="pplus"
                                onClick={() => {
                                  let temprice = pricer[id] ? pricer[id] : "obj.price";
                                  let price = eval(temprice);
                                  let qual = quality[id] ? quality[id] : "1";

                                  let tempObj = {
                                    id: id + "quality" + qual,
                                    quality: qual,
                                    name: obj.name + " " + qual,
                                    price: price,
                                    productImage: obj.productImage
                                  };
                                  addCart(tempObj);
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </motion.button>
                            </motion.div>
                          </div>
                        </Grid>
                      ))}
                  </Grid>
                </div>
              </div>
            </TabPane>

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
      </Tabs>

    </motion.div >
  );
}

export default Content;
