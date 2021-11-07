import { useEffect, useState } from "react";
import axios from "axios";
import { Empty } from "antd";
import Content from "./components/content/content";
import Grid from "@material-ui/core/Grid";
import { CartProvider } from "react-use-cart";
import Check from "./components/check/check";
import { useHistory } from "react-router-dom";
import Search from "./components/search/search";
import { MobileView, isMobileOnly } from "react-device-detect";
import Bottomcart from "./components/bottomCart/bottomcart";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import HomeIcon from "@material-ui/icons/Home";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

import text from "./text.txt";
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
function Home() {
  console.log(text);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [opens, setOpens] = useState(false);

  let history = useHistory();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      (async function () {
        axios
          .get("http://localhost:4000/data")
          .then((res) => {
            setData(res.data);
            setLoading(false);
          })
          .catch(() => {
            setError(true);
          });
      })();
    }, 1000);
  }, []);

  if (error === true)
    return (
      <Empty
        description="Server is not working please refresh page or contact administrator"
        style={{ marginTop: "200px" }}
      />
    );
  return (
    <div className="App">
      <CartProvider>
        <MobileView>
          <Bottomcart opens={opens} func={setOpens} />
        </MobileView>

        <Grid container spacing={0}>
          {/* <Grid item xs={12} lg={12} sm={12}>
            <Search loading={loading} data={data} />
          </Grid> */}
          <Grid item xs={12} md={8} lg={8} sm={6}>
            <Content loading={loading} data={data} />
          </Grid>
          <Grid item xs={12} md={4} lg={4} sm={6}>
            {isMobileOnly ? null : <Check />}
          </Grid>
        </Grid>

        {isMobileOnly ? (
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            className={classes.stickToBottom}
          >
            <BottomNavigationAction label="Asosiy" icon={<HomeIcon />} />
            <BottomNavigationAction
              onClick={() => setOpens(true)}
              label="Savatcha"
              icon={<ShoppingCartIcon />}
            />
            <BottomNavigationAction
              onClick={() => history.push("/check")}
              label="Buyurtmalar tarixi"
              icon={<RestoreIcon />}
            />
          </BottomNavigation>
        ) : null}
      </CartProvider>
    </div>
  );
}

export default Home;
