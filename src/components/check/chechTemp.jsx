import React, { useState } from 'react'
import { useCart } from "react-use-cart";
import { motion, AnimatePresence } from "framer-motion"
import Divider from '@material-ui/core/Divider';
import "./check.css"
import { useEffect } from 'react'

function Temp({ tempID }) {


    const [anim, setAnim] = useState(0)

    const itemss = {
        hidden: { opacity: 0 },
        show: { opacity: 1 }
    }
    const height = window.innerHeight - 30 + "px"






    return (

        <div style={{ marginTop: "20px" }}>


            <motion.div
                className="mywrapperr"
                style={{ height: height }}
            >

                <p style={{ fontSize: "24px", marginBottom: '0px' }}> Check list </p>

                <Divider style={{ background: "blue" }} />
                <div className="main">





                    {tempID && tempID.map((item) => (


                        <div key={item.id} className="" >
                            <motion.div
                                variants={itemss}
                                transition={{ duration: 0.4 }}

                                initial={{ x: 160 }}
                                animate={{ x: anim }}
                                className='productts'>

                                <div><p className="firstName">{item.name}</p>
                                    <motion.p className="secondName"


                                    >{item.price * item.quantity} </motion.p>
                                </div>
                                <div className="productss">



                                </div>
                            </motion.div>
                        </div>

                    ))}
                </div>

            </motion.div>
        </div >
    )
}

export default Temp

