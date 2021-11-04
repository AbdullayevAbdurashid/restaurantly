import React from "react";
import "./search.css";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import CurrencyFormat from "react-currency-format";
import { motion } from "framer-motion";
import SearchIcon from "@material-ui/icons/Search";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useCart } from "react-use-cart";
import Skeleton from "@material-ui/lab/Skeleton";

function Search({ data, loading }) {

  const [anim, setAnim] = React.useState();
  const [isSearch, setSearch] = React.useState(false);
  const { addItem } = useCart();
  const [alldata, setAlldata] = React.useState(dataSet(data));

  React.useEffect(() => {
    setAlldata(dataSet(data));
  }, [data]);

  function dataSet(obj) {
    if (Object.keys(obj).length > 0) {
      return Object.values(obj).reduce((arr, el) => [...arr, ...el]);
    }
  }


  const animSet = () => {
    if (isSearch === true) {
      setAnim(-200);
      setSearch(false);
    } else {
      setAnim(0);
      setSearch(true);
    }
  };
  const addCart = (obj) => {
    addItem(obj);
  };

  const { getRootProps, getInputProps, getListboxProps, groupedOptions } =
    useAutocomplete({
      id: "use-autocomplete-demo",
      options: alldata,
      getOptionLabel: (option) => option.name,
    });

  return (
    <div className="searchMain">
      {loading ? (
        <Skeleton width={300} height={50} animation="wave" />
      ) : (
        <div>
          <div {...getRootProps()}>
            {/* {!alldata && <p>Loding search please wait...</p>} */}
            <motion.input
              animate={{ y: anim }}
              transition={{ duration: 0.8 }}
              initial={{ y: -480 }}
              className="searchInput"
              {...getInputProps()}
            />
            <motion.button
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              onClick={() => animSet()}
              className="searcher"
            >
              {" "}
              {!isSearch ? (
                <motion.span
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {" "}
                  <SearchIcon
                    style={{ color: "rgb(24, 124, 223)" }}
                    fontSize="large"
                  />
                </motion.span>
              ) : (
                <HighlightOffIcon style={{ color: "red" }} fontSize="large" />
              )}{" "}
            </motion.button>
          </div>
          {groupedOptions.length > 0 ? (
            <motion.div
              initial={{ y: -180 }}
              className="searchWrapper"
              animate={{ y: 1 }}
              transition={{ duration: 0.5 }}
              {...getListboxProps()}
            >
              {groupedOptions.map((obj, index) => (
                <div className="searchOne" {...getListboxProps()}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexWrap: "no-wrap",
                      width: "90% ",
                    }}
                  >
                    <p className="firstNames">{obj.name}</p>

                    <CurrencyFormat
                      value={obj.price}
                      displayType={"text"}
                      suffix=" sum"
                      thousandSeparator={true}
                      renderText={(value) => (
                        <p className="secondName">{value} </p>
                      )}
                    />
                  </div>


                  <div style={{ marginTop: "auto", marginBottom: "-10px", marginLeft: "auto", display: "flex" }}>
                    <motion.button
                      whileTap={{ scale: 1.1 }}
                      className="button_plus"
                      onClick={() => {

                        let tempObj = {
                          id: obj._id + "qual1",
                          name: obj.name + " 1",
                          price: obj.price,
                        };
                        addCart(tempObj);
                      }}
                    >
                      +{" "}
                    </motion.button>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : null}
        </div>
      )
      }
    </div >
  );
}

export default Search;
