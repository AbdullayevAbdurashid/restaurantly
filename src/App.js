import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";

function App() {
  return (
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
  );
}

export default App;
