import React from 'react'
import { Container } from '@material-ui/core'
import { Tabs } from 'antd';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Divider from "@material-ui/core/Divider";
import clsx from 'clsx';
import useAuth from "../../context/useAuth"
import backgound from "./back.jpg"
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { motion } from 'framer-motion';
import Badge from "@material-ui/core/Badge";
import { io } from "socket.io-client";
import { Popconfirm } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Grow from "@material-ui/core/Grow";
import { message } from 'antd';
import { IpContext } from "../../context/ipProvider"
import { useContext } from 'react';
const { TabPane } = Tabs;



const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        marginBottom: "5px",
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },

}));
const StyledBadge = withStyles((theme) => ({
    badge: {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: "0 4px",
    },
}))(Badge);


function Waiter() {
    const { user } = useAuth();
    const [ip, socket] = useContext(IpContext)
    const [myorder, setOrder] = useState([])
    const getOrder = (table) => {
        axios.post(`${ip}/occupyOrder`, { table: table, name: user }).then(() => {
            axios.get(`${ip}/waiterOrders/${user}`).then(({ data }) => {
                setOrder(data);

            });
            axios.get(`${ip}/waiterOrders/new`).then(({ data }) => {
                setData(data);
                setVisible(false);
                setConfirmLoading(false);
            });

        });

    }

    const [data, setData] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(false);
    const notify = () => {
        message.success("Yangi zakaz bor")
    }
    console.log(user)
    useEffect(() => {
        socket.on("recieve-order", (message) => {
            if (message === "order sent") {
                notify("order recieved")
            } (async function () {
                const { data } = await axios.get(`${ip}/waiterOrders/new`);
                data.reverse()
                setData(data);
            })();
        });
        (async function () {
            const { data } = await axios.get(`${ip}/waiterOrders/new`);
            data.reverse()
            setData(data);

        })();

        (async function () {
            const { data } = await axios.get(`${ip}/waiterOrders/${user}`);
            data.reverse()
            setOrder(data);

        })();
    }, []);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const handleLogout = () => {
        localStorage.setItem("details", "false")
        window.location.reload();

    }
    const classes = useStyles();
    const handleOk = (table) => {
        setConfirmLoading(true);
        getOrder(table)
    };

    const handleCancel = () => {
        setVisible(false);
    };
    const handleExpandClick = (index, isExpanded) => {
        setExpanded({ ...expanded, [index]: !expanded[index] ? true : false });
    };
    const handleExpandOrder = (index) => {
        setExpandedOrder({ ...expandedOrder, [index]: !expandedOrder[index] ? true : false });
    };

    const [visible, setVisible] = useState(false);


    return (
        <div style={{ backgroundImage: `url(${backgound})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className=" waiters min-h-screen">

            <Container maxWidth="md" className=" min-h-screen backdrop-filter  backdrop-blur-md">


                <div className="text-white bg-image   h-full">
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane className="text-white " tab="Current orders" key="1">

                            {data &&
                                data.map((obj, index) => (
                                    <Grow in={true}>
                                        <Card className="mb-4">
                                            <CardContent>
                                                <h1 className="text-yellow-500 text-xl font-bold">
                                                    #{data.length - index}
                                                </h1>
                                                <h3 className="text-green-400 -mt-3  text-sm font-bold ">
                                                    {(Number(obj.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(obj.time.split(":")[1])) + " min oldin" : (new Date().getHours() - Number(obj.time.split(":")[0])) + " soat oldin"}                                             </h3>
                                                <h2 className="absolute top-4 right-4  text-yellow-500 text-lg font-bold ">
                                                    Stol: {obj.table}
                                                </h2>
                                                <h3 className="text-white text-lg font-medium">
                                                    Jami taomlar:{data[index].foods.length}
                                                </h3>

                                            </CardContent>
                                            <CardActions disableSpacing>

                                                <h3 className="text-white text-lg font-medium">
                                                    Taomlar:
                                                </h3>
                                                <span className="inline-block">
                                                    <IconButton
                                                        className={clsx(classes.expand, {
                                                            [classes.expandOpen]: expanded[index]
                                                                ? expanded[index] : null,
                                                        })}
                                                        onClick={() => handleExpandClick(index)}
                                                        aria-expanded={expanded}
                                                        aria-label="show more"
                                                    >
                                                        <ExpandMoreIcon className="text-white  mb-1" fontSize="large" />
                                                    </IconButton>
                                                    <Popconfirm
                                                        title="DO YOU CONFIRM?"
                                                        visible={visible}
                                                        onConfirm={() => handleOk(obj.table)}
                                                        okButtonProps={{ loading: confirmLoading }}
                                                        onCancel={handleCancel}
                                                    >
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setVisible(true)}
                                                            className="w-24 absolute bottom-4 right-2 bg-gradient-to-r  d from-blue-700 h-10 rounded-xl  text-lg  focus:ring-offset-indigo-800 focus:border-transparent transit to-blue-800  text-white" type="submit">
                                                            Olish ✅
                                                        </motion.button>
                                                    </Popconfirm>
                                                </span>
                                            </CardActions>
                                            <Collapse in={expanded[index]
                                                ? expanded[index] : null
                                            } timeout="auto" unmountOnExit>
                                                {
                                                    data[index].foods.map((foodObj, indx) => (
                                                        <CardContent>
                                                            <div key={indx}>
                                                                <span>
                                                                    <p className=" text-white text-xl  uppercase">{foodObj.name}</p>
                                                                    <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                                                <h2 className=" text-yellow-400 text-xl"> 2x </h2>

                                                            </div>


                                                        </CardContent>
                                                    ))}
                                            </Collapse>
                                        </Card>
                                    </Grow>

                                ))}



                        </TabPane>
                        <TabPane tab={<StyledBadge showZero badgeContent={myorder.length} color="secondary">
                            <h1 className="text-white pt-2  ">
                                My orders
                            </h1>
                        </StyledBadge>} key="2">

                            {myorder &&
                                myorder.map((obj, index) => (
                                    <Grow in={true}>
                                        <Card className="mb-4">
                                            <CardContent>
                                                <h1 className="text-yellow-500 text-xl font-bold">
                                                    ORDER #325
                                                </h1>
                                                <h3 className=" text-green-400 -mt-3  text-sm font-bold ">
                                                    12:20
                                                </h3>
                                                <h2 className="absolute top-4 right-4  text-yellow-500 text-lg font-bold ">
                                                    Stol: {obj.table}
                                                </h2>
                                                <h3 className="text-white text-lg font-medium">
                                                    Jami taomlar:{myorder[index].foods.length}
                                                </h3>

                                            </CardContent>
                                            <CardActions disableSpacing>

                                                <h3 className="text-white text-lg font-medium">
                                                    Taomlar:
                                                </h3>
                                                <span className="inline-block">
                                                    <IconButton
                                                        className={clsx(classes.expand, {
                                                            [classes.expandOpen]: expanded[index]
                                                                ? expanded[index] : null,
                                                        })}
                                                        onClick={() => handleExpandOrder(index)}
                                                        aria-expanded={expanded}
                                                        aria-label="show more"
                                                    >
                                                        <ExpandMoreIcon className="text-white  mb-1" fontSize="large" />
                                                    </IconButton>
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={getOrder}
                                                        className="w-24 absolute bottom-4 right-2 bg-gradient-to-r  d from-blue-700 h-10 rounded-xl  text-lg  focus:ring-offset-indigo-800 focus:border-transparent transit to-blue-800  text-white" type="submit">
                                                        Olish ✅
                                                    </motion.button>
                                                </span>
                                            </CardActions>
                                            <Collapse in={expandedOrder[index]
                                                ? expandedOrder[index] : null
                                            } timeout="auto" unmountOnExit>
                                                {
                                                    myorder[index].foods.map((foodObj, indx) => (
                                                        <CardContent>
                                                            <div key={indx}>
                                                                <span>
                                                                    <p className=" text-white text-xl  uppercase">{foodObj.name}</p>
                                                                    <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                                                <h2 className=" text-yellow-400 text-xl"> 2x </h2>

                                                            </div>


                                                        </CardContent>
                                                    ))}
                                            </Collapse>
                                        </Card>
                                    </Grow>

                                ))}




                            {/* <Card className="mb-4">
                                <CardContent>
                                    <h1 className="text-yellow-500 text-xl font-bold">
                                        ORDER #325
                                    </h1>
                                    <h3 className=" text-green-400 -mt-3  text-sm font-bold ">
                                        12:20
                                    </h3>
                                    <h2 className="absolute top-4 right-4  text-yellow-500 text-lg font-bold ">
                                        Stol:12
                                    </h2>
                                    <h3 className="text-white text-lg font-medium">
                                        Jami taomlar:12
                                    </h3>

                                </CardContent>
                                <CardActions disableSpacing>
                                    <h3 className="text-white text-lg font-medium">
                                        Taomlar:
                                    </h3>
                                    <span className="inline-block">
                                        <IconButton
                                            className={clsx(classes.expand, {
                                                [classes.expandOpen]: expanded,
                                            })}
                                            onClick={handleExpandClick}
                                            aria-expanded={expanded}
                                            aria-label="show more"
                                        >
                                            <ExpandMoreIcon className="text-white  mb-1" fontSize="large" />
                                        </IconButton>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            className="w-24 absolute bottom-5 right-2 bg-gradient-to-r  d from-red-800 h-10 rounded-xl  text-lg  focus:ring-offset-indigo-800 focus:border-transparent transit to-red-500  text-white" type="submit">
                                            End order
                                        </motion.button>
                                    </span>
                                </CardActions>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <div>
                                            <span>
                                                <p className=" text-white text-xl  uppercase">Shorva</p>
                                                <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                            <h2 className=" text-yellow-400 text-xl"> 2x </h2>

                                        </div>
                                        <div>
                                            <span>
                                                <p className=" text-white text-xl  uppercase">Mastava</p>
                                                <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                            <h2 className=" text-yellow-400 text-xl"> 4x </h2>

                                        </div>
                                        <div>
                                            <span>
                                                <p className=" text-white text-xl  uppercase">Lavash</p>
                                                <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                            <h2 className=" text-yellow-400 text-xl"> 1x </h2>

                                        </div>
                                        <div>
                                            <span>
                                                <p className=" text-white text-xl  uppercase">Pepsi 0.5 </p>
                                                <Divider style={{ background: "white", marginTop: "-20px" }} /></span>
                                            <h2 className=" text-yellow-400 text-xl"> 1x </h2>

                                        </div>
                                    </CardContent>
                                </Collapse>
                            </Card> */}
                        </TabPane>

                    </Tabs>
                </div>
                <motion.button

                    onClick={handleLogout}
                    className="bg-red-500 text-white  w-24    text-lg h-10  absolute bottom-4 left-12  ">
                    Logout

                </motion.button>
            </Container >

        </div>
    )
}

export default Waiter
