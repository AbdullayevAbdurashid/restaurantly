import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  AuthenticatedRoute,
} from "react-router-dom";

import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";
import Login from "./components/waiters/login";
import Waiter from "./components/waiters/waiters";
import { AuthProvider } from "./context/useAuth";
import Myorders from "./components/myorders/myorders";
import useIp, { IPprovider } from "./context/ipProvider";
function Routes() {
  return (
    <Router>
      <Switch>
        <IPprovider>
          <Route path="/check" component={Overall} />
          <Route exact path="/" component={Home} />
          <AuthProvider>
            <Route path="/login" component={Login} />
            <Route path="/waiter" component={Waiter} />
          </AuthProvider>

          <Route path="/myorders" component={Myorders} />
        </IPprovider>
      </Switch>
    </Router>
  );
}

function App() {
  // const { user, loading, error, login, signUp, logout } = useAuth();

  return (
    <CartProvider>
      <Routes />
    </CartProvider>
  );
}

export default App;
