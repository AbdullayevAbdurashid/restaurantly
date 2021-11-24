import React from "react";
import { useState } from "react";
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
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Grow from "@material-ui/core/Grow";

import useIp from "../../context/ipProvider";
function Content({ data, loading }) {
  const { TabPane } = Tabs;
  const { ip, socket } = useIp();

  const [quality, setQuality] = useState({});
  const [pricer, setPrice] = useState({});
  const { addItem } = useCart();
  const height = window.innerHeight + "px";
  let keys = Object.keys(data);

  const addCart = (obj) => {
    addItem(obj);
  };

  const handleChange = (e, quality, id) => {
    setPrice({ ...pricer, [id]: e.target.value });
    setQuality({ ...quality, [id]: quality });
  };

  return (
    <div
    >
      <Tabs type="card" size={"large"}>
        {keys &&
          keys.map((key, indx) => (
            <TabPane tab={key} key={indx}>
              <LazyLoad once={true}>
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
                            <Grow in={true}>
                              <Card className="min-h-90">
                                <div
                                // onClick={() => {
                                //   let temprice = pricer[id]
                                //     ? pricer[id]
                                //     : "obj.price";
                                //   let price = eval(temprice);
                                //   let qual = quality[id] ? quality[id] : "1";

                                //   let tempObj = {
                                //     id: id + "quality" + qual,
                                //     quality: qual,
                                //     name: obj.name + " " + qual,
                                //     price: price,
                                //     productImage: obj.productImage,
                                //   };

                                //   addCart(tempObj);
                                // }}
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
                                      Qoshish uchun ustiga bosin
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
                                  {/* <motion.button
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

                                  <AddIcon />
                                </motion.button> */}
                                </CardActions>
                              </Card>
                            </Grow>
                          </Grid>
                          // <Grid item xs={12} sm={12} md={6} lg={4}>
                          //   <div>

                          //     <LazyLoad height={65}>
                          //       <motion.div key={obj.id} className="products">

                          //

                          //         <div>
                          //           <p className="firstName">{obj.name}</p>

                          //         </div>

                          //       </motion.div>
                          //     </LazyLoad>

                          //   </div>
                          // </Grid>
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
