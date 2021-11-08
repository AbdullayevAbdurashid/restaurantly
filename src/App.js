import "./App.css";
import { useEffect, useState } from "react";
// import ResponsiveDrawer from "./components/sidebar/sidebar";
import axios from "axios";
import { Empty } from "antd";

import Content from "./components/content/content";
import Grid from "@material-ui/core/Grid";
import { CartProvider } from "react-use-cart";
import Check from "./components/check/check";
// import Search  from './components/search/search';
import Search from "./components/search/search";
import Overall from "./components/overall/overall";

function App() {
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
        {/* <Overall /> */}
        <Grid container spacing={1}>
          <Grid item xs={12} lg={12} sm={12}>
            <Search loading={loading} data={data} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Content loading={loading} data={data} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Check />
          </Grid>
        </Grid>
      </CartProvider>
    </div>
  );
}

export default App;
