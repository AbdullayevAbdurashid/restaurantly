import './App.css';
import ResponsiveDrawer from "./components/sidebar/sidebar";
import Content from "./components/content/content"
import Grid from '@material-ui/core/Grid';
import { CartProvider } from "react-use-cart";
import Check from './components/check/check';

function App() {


  return (
    <div className="App">
      <CartProvider>

        <Grid container spacing={1}>
          {/* <Grid item xs={1} sm={2}>

            <ResponsiveDrawer />
          </Grid > */}
          <Grid item xs={8} sm={8}>
            <Content />
          </Grid >
          <Grid item xs={4} sm={4}>
            <Check />
          </Grid >
        </Grid >
      </CartProvider>

    </div >
  );
}

export default App;
