import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { lazy, Suspense } from "react";
import Home from "./home";
import { CartProvider } from "react-use-cart";
import Overall from "./components/overall/overall";
import { AuthProvider } from "./context/useAuth";
import { IPprovider } from "./context/ipProvider";
import { Notifications } from "react-push-notification";

const Login = lazy(() => import("./components/waiters/login"));
const Waiter = lazy(() => import("./components/waiters/waiters"));
const Admin = lazy(() => import("./pages/admin"));

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
              <Route path="/admin" component={Admin} />
              <Route exact path="/waiter" component={Waiter} />{" "}
            </Suspense>
          </AuthProvider>
        </IPprovider>
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <div className="App">
      <CartProvider>
        <Routes />
      </CartProvider>
    </div>
  );
}

export default App;
