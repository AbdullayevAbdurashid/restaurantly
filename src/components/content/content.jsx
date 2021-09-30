import React from 'react'
import { motion } from "framer-motion"
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import { useEffect, useState } from 'react'
import placeholder from './placeholder.png';
import "./content.css"
import { useCart } from "react-use-cart";

function Content() {
    const [quality, setQuality] = useState("1")
    const [data, setData] = useState("")



    const { addItem } = useCart();



    const height = window.innerHeight - 20 + "px"
    useEffect(() => {
        (async function () {
            let { data: tempData } = await axios.get("http://localhost:4000/data");
            setData(tempData)
        })()


    }, [])
    let keys = Object.keys(data)



    return (
        <motion.div initial={{ x: -660 }}
            animate={{ x: 0 }}
            transition={{ type: "tween", stiffness: 50, duration: 0.5 }} style={{ display: "flex", gap: "20px", marginTop: "20px", marginLeft: "70px", flexWrap: "wrap", height: height, overflow: "auto" }}>
            {
                keys.map((key, indx) => (
                    <div key={indx} className="mywrapper">
                        <p className="cotegory">{key}</p>
                        <Divider style={{ background: "blue" }} />
                        {data[key].map(({ _id: id, ...obj }) => (

                            <motion.div className='products'>

                                <img src={placeholder} alt="x" />
                                <div><p className="firstName">{obj.name}</p>
                                    <p className="secondName">{obj.price} sum </p>

                                    <motion.button className="quality" whileTap={{ scale: 1.1 }}
                                        onClick={() => {
                                            setQuality("1")
                                        }}>1</motion.button>
                                    <motion.button className="quality" whileTap={{ scale: 1.1 }}
                                        onClick={() => {
                                            setQuality("0.5")
                                        }}>0.5</motion.button>
                                    <motion.button className="quality" whileTap={{ scale: 1.1 }}
                                        onClick={() => {
                                            setQuality("0.7")
                                        }}>0.7</motion.button>
                                </div>


                                <motion.button
                                    whileTap={{ scale: 1.1 }}

                                    className="plus" onClick={() => {

                                        let tempObj = {

                                            id: id + "quality" + quality,
                                            quality: quality,
                                            name: obj.name + " " + quality,
                                            price: obj.price * quality,

                                        }
                                        addItem(tempObj)
                                    }

                                    }
                                >+ </motion.button>
                            </motion.div>
                        ))}
                    </div>
                ))
            }



        </motion.div >
    )
}

export default Content
