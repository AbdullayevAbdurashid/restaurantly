import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';


//Antd
import { Tabs } from 'antd';
import { Badge as Fedge } from 'antd';
import { Popconfirm, Modal } from 'antd';
import { message } from 'antd';

//Material Ui
import { Container } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import Divider from "@material-ui/core/Divider";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Badge from "@material-ui/core/Badge";
import { Fab } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

//
import useAuth from "../../context/useAuth"
import backgound from "./back.jpg"
import Grow from "@material-ui/core/Grow";
import { IpContext } from "../../context/ipProvider"
import { useContext } from 'react';
import addNotification from 'react-push-notification';


import { Redirect } from 'react-router';
import { motion } from 'framer-motion';

//Sounds
import neworder from "./sounds/neworder.mp3"
import complete from "./sounds/complete.mp3"
import call from "./sounds/waitercalling.mp3"

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

function info() {
    Modal.info({
        title: 'Please accept cookies',
        content: (
            <div>
                <p>Accept cookies to send notification</p>
            </div>
        ),
        onOk() { },
    });
}
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
        let audio = new Audio(neworder)
        audio.play()
        addNotification({
            title: 'Yangi zakaz',
            subtitle: `Yangi zakaz keldi iltimos tekshiring`,
            theme: 'darkblue',
            native: true // when using native, your OS will handle theming.
        });
        message.warning("Yangi zakaz keldi iltimos tekshiring")
    }
    const notifySilent = () => {
        if (myorder.length === 0) {
            let audio = new Audio(neworder)
            audio.play()
            message.warning("Yangi zakaz tushdi")

        }

    }
    const notifyOrderTaken = (table, waiter) => {
        if (waiter === user) {
            let audio = new Audio(complete)
            audio.play()
            message.success(`${table}chi stolni zakazi tayyor`)
            addNotification({
                title: 'Zakaz tayyor',
                subtitle: `${table}chi stolni zakazi tayyor`,
                theme: 'darkblue',
                native: true // when using native, your OS will handle theming.
            });
        }
    }

    const notifyWaiterCalling = (table, waiter) => {
        if (waiter === user) {
            addNotification({
                title: 'Sizni chaqirishyapti',
                subtitle: `${table}- chi stol sizni chaqiryapti`,
                theme: 'darkblue',
                native: true // when using native, your OS will handle theming.
            });
            let audio = new Audio(call)
            audio.play()
            Modal.info({
                title: 'Sizni chaqirishyapti',
                content: (
                    <div>
                        <p>{table} - chi stol sizni chaqiryapti</p>
                    </div>
                ),
                onOk() { },
            });
            let duraction = setInterval(() => {
                let audio = new Audio(call)
                audio.play()
            }, 1000);

            setTimeout(() => {
                clearInterval(duraction)
                socket.emit("")
            }, 3000);

        }
    }


    useEffect(() => {
        socket.on("recieve-order", (message) => {
            if (message === "none") {
                notifySilent()
            } else {
                if (message === user) {
                    notify();
                    (async function () {
                        const { data } = await axios.get(`${ip}/waiterOrders/${user}`);
                        data.reverse()
                        setOrder(data);
                    })();

                }
            }
            (async function () {
                const { data } = await axios.get(`${ip}/waiterOrders/new`);
                data.reverse()
                setData(data);
            })();
        });

        socket.on("take-order", ({ table, responsibleWaiter }) => {



            notifyOrderTaken(table, responsibleWaiter)

        });

        socket.on("coming", ({ table, responsibleWaiter }) => {

            notifyWaiterCalling(table, responsibleWaiter)

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
        info()
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


    const handleExpandClick = (index, isExpanded) => {
        setExpanded({ ...expanded, [index]: !expanded[index] ? true : false });
    };
    const handleExpandOrder = (index) => {
        setExpandedOrder({ ...expandedOrder, [index]: !expandedOrder[index] ? true : false });
    };
    const setVisibleConfirm = (index) => {
        setVisible({ ...visible, [index]: !visible[index] ? true : false });
    };


    const [visible, setVisible] = useState(false);
    if (localStorage.getItem("details") === "false" || !localStorage.getItem("details"))
        return (
            <Redirect to="/login" />
        );

    return (
        <div style={{ backgroundImage: `url(${backgound})`, marginBottom: "30px", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} className=" waiters min-h-screen">

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
                                                    ORDER #{data.length - index}
                                                </h1>
                                                <h3 className="text-green-400   text-sm font-bold ">
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
                                                        title="Tasdiqlaysizmi?"
                                                        visible={visible[index]}
                                                        onConfirm={() => handleOk(obj.table)}
                                                        okButtonProps={{ loading: confirmLoading }}
                                                        onCancel={() => setVisibleConfirm(index)}
                                                    >
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => setVisibleConfirm(index)}
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
                                                                    <Divider style={{ background: "white", }} /></span>
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
                                                    ORDER #{myorder.length - index}
                                                </h1>
                                                <h3 className=" text-green-400 text-sm font-bold ">
                                                    {(Number(obj.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(obj.time.split(":")[1])) + " min oldin" : (new Date().getHours() - Number(obj.time.split(":")[0])) + " soat oldin"}                                                                             </h3>
                                                <h2 className="absolute bottom-6 right-4  text-yellow-500 text-lg font-bold ">
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
                                                                    <Divider style={{ background: "white", }} /></span>
                                                                <h2 className=" text-yellow-400 text-xl"> {foodObj.quantity}x </h2>

                                                            </div>


                                                        </CardContent>
                                                    ))}
                                            </Collapse>
                                        </Card>
                                    </Grow>
                                ))}





                        </TabPane>

                    </Tabs>
                </div>
            </Container >
            <Fab style={{ position: "fixed", bottom: "30px", right: "5px" }}
                color="secondary" aria-label="add"
                onClick={handleLogout}
            >
                <ExitToAppIcon />
            </Fab>





        </div >
    )
}

export default Waiter
