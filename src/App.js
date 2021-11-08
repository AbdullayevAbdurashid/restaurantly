import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";

function App() {
  return (
<<<<<<< HEAD
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
=======
    <CartProvider>
      <Router>
        <Switch>
          <div className="App" style={{ maxHeight: "200px" }}>
            <Route path="/check" component={Overall} />
            <Route exact path="/" component={Home} />
          </div>
        </Switch>
      </Router>
    </CartProvider>
>>>>>>> 4aa35e655d3393d2d2343f0950170b94c494a431
  );
}

export default App;
