import React from "react";
import { useState, useContext } from "react";
import "antd/dist/antd.css";
import Skeleton from "@material-ui/lab/Skeleton";
import { Radio } from "antd";
import placeholder from "./placeholder.png";
import "./content.css";
import { useCart } from "react-use-cart";
import Grid from "@material-ui/core/Grid";
import CurrencyFormat from "react-currency-format";
import { Tabs } from "antd";
import LazyLoad from "react-lazyload";
import { motion } from "framer-motion";
//MUI
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
//Others
import { IpContext } from "../../context/ipProvider"
import { Popconfirm } from 'antd';
import { message } from "antd";
function Content({ data, loading }) {
  const { TabPane } = Tabs;
  const [ip, socket] = useContext(IpContext)
  const [quality, setQuality] = useState({});
  const [pricer, setPrice] = useState({});
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const { addItem } = useCart();
  let keys = Object.keys(data);

  const addCart = (obj) => {
    addItem(obj);
  };


  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = () => {
    socket.emit("call-waiter", sessionStorage.getItem("table"))
    setConfirmLoading(true);

    socket.on("coming", ({ responsibleWaiter }) => {
      if (responsibleWaiter !== "none") {
        message.success("Ofitsiant kelyapti")
        setConfirmLoading(false);
        setVisible(false);

      } else {
        setTimeout(() => {
          message.error("Ofitsiantlar hozir band, iltimos qayta uruning", 4000)
          setConfirmLoading(false);
          setVisible(false);
        }, 6000);
      }
    });

  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChange = (e, quality, id) => {
    setPrice({ ...pricer, [id]: e.target.value });
    setQuality({ ...quality, [id]: quality });
  };
  return (
    <div
    >
      <Popconfirm
        title="Ofitsiantni chaqrilaylikmi?"
        visible={visible}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
      >
        <Fab color="primary" onClick={showPopconfirm} style={{ position: "fixed", bottom: "80px", right: "10px ", zIndex: "9999999" }} aria-label="add">
          <NotificationsActiveIcon />
        </Fab>
      </Popconfirm>

      <Tabs type="card"
        unmountInactiveTabs={true}
        size={"large"}>
        {keys &&
          keys.map((key, indx) => (
            <TabPane tab={key} key={indx}>
              <LazyLoad overflow={true} once={true}>
                <div>
                  <div
                    key={indx}
                    className="h-screen mywrapper"
                    style={{

                      padding: "10px",
                      marginBottom: "70PX",
                    }}
                  >
                    <Grid container spacing={2}>
                      {data &&
                        data[key].map(({ _id: id, ...obj }, index) => (
                          <Grid item xs={6} sm={6} md={4} lg={3}>
                            <LazyLoad once={true}>

                              <Grow

                                in={true}
                                unmountOnExit>
                                <Card className="min-h-90">
                                  <div

                                  >
                                    <CardMedia
                                      component="img"
                                      alt="Ovqat"
                                      className="h-32"
                                      image={
                                        obj.productImage === "null" ||
                                          !obj.productImage
                                          ? placeholder
                                          : `${ip}/` +
                                          obj.productImage
                                      }
                                    />
                                    <CardContent>
                                      <div className="relative ml-auto ">
                                        <motion.button
                                          whileTap={{ scale: 0.9 }}
                                          className="pplus absolute -right-2 -top-10  h-10 w-10 bg-red-100"
                                          onClick={() => {

                                            let temprice = pricer[id]
                                              ? pricer[id]
                                              : "obj.price";
                                            let price = eval(temprice);
                                            let qual = quality[id] ? quality[id] : "1";

                                            let tempObj = {
                                              id: id + "quality" + qual,
                                              quality: qual,
                                              name: obj.name + " " + qual,
                                              price: price,
                                              productImage: obj.productImage,
                                            };

                                            addCart(tempObj);
                                          }}
                                        >
                                          <AddIcon fontSize="medium" />
                                        </motion.button></div>
                                      <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="h3"
                                      >
                                        {obj.name}
                                      </Typography>
                                      <CurrencyFormat
                                        value={
                                          pricer[id]
                                            ? eval(pricer[id])
                                            : obj.price
                                        }
                                        displayType={"text"}
                                        suffix=" sum"
                                        thousandSeparator={true}
                                        renderText={(value) => (
                                          <p
                                            className="secondName"
                                            style={{ marginTop: "1px" }}
                                          >
                                            {value}{" "}
                                          </p>
                                        )}
                                      />

                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        component="p"
                                      >
                                        {obj.description}
                                      </Typography>
                                    </CardContent>
                                  </div>
                                  <CardActions>
                                    <Radio.Group
                                      defaultValue="obj.price"
                                      size="medium"
                                    >
                                      <Radio.Button
                                        onClick={(e) => handleChange(e, "1", id)}
                                        disabled={obj.price ? false : true}
                                        value="obj.price"
                                      >
                                        1.0
                                      </Radio.Button>
                                      <Radio.Button
                                        disabled={obj.price05 ? false : true}
                                        onClick={(e) =>
                                          handleChange(e, "0.5", id)
                                        }
                                        value="obj.price05"
                                      >
                                        0.5
                                      </Radio.Button>
                                      <Radio.Button
                                        disabled={obj.price07 ? false : true}
                                        onClick={(e) =>
                                          handleChange(e, "0.7", id)
                                        }
                                        value="obj.price07"
                                      >
                                        0.7
                                      </Radio.Button>
                                    </Radio.Group>

                                  </CardActions>
                                </Card>
                              </Grow>
                            </LazyLoad>
                          </Grid>
                        ))}
                    </Grid>
                  </div>
                </div>
              </LazyLoad>
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
    </div>
  );
}

export default Content;
