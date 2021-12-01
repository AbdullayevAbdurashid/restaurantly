import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";
import useAuth, { AuthProvider } from "./context/useAuth";
import { IPprovider } from "./context/ipProvider";
import { Notifications } from "react-push-notification";

const Login = lazy(() => import("./components/waiters/login"));
const Waiter = lazy(() => import("./components/waiters/waiters"));

function AuthenticatedRoute({ roles, ...props }) {
  const { user } = useAuth();

  return <Route {...props} />;
}
//TO DO
// ADD LAZY LOAD WAITER
function Routes() {
  return (
    <Router>
      <Switch>
        <IPprovider>
          <Route path="/check" component={Overall} />
          <Route exact path="/" component={Home} />
          <AuthProvider>
            <Suspense fallback={<div>Загрузка...</div>}>
              <Notifications />
              <Route path="/login" component={Login} />
              <AuthenticatedRoute
                exact
                path="/waiter"
                component={Waiter}
              />{" "}
            </Suspense>
          </AuthProvider>
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
