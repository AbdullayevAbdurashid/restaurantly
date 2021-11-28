import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";
import Login from "./components/waiters/login";
import Waiter from "./components/waiters/waiters";
import useAuth, { AuthProvider } from "./context/useAuth";
import Myorders from "./components/myorders/myorders";
import { IPprovider } from "./context/ipProvider";

function AuthenticatedRoute({ roles, ...props }) {
  const { user } = useAuth();

  if (!user) return <Redirect to="/login" />;

  return <Route {...props} />;
}

function Routes() {


  return (
    <Router>
      <Switch>
        <IPprovider>
          <Route path="/check" component={Overall} />
          <Route exact path="/" component={Home} />
          <AuthProvider>
            <AuthenticatedRoute
              exact
              path="/waiter"
              component={Waiter}
            />
            <Route exact path="/login" component={Login} />

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
