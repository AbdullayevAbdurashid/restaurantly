import React from 'react'
import { motion } from "framer-motion";

export default function ButtonMain({ styles, onClicks, content }) {
    return (
        <motion.button
            className={styles}
            onClick={onClicks}
            whileTap={{ scale: 0.7 }}>

            {content}
        </motion.button >
    )
}
