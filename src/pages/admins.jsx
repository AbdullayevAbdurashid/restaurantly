import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { IpContext } from '../context/ipProvider';
import { MobileView, BrowserView } from 'react-device-detect';
//MUI
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from "@material-ui/core/Divider";
import Grow from "@material-ui/core/Grow";
import { Container } from '@material-ui/core';
import { motion } from 'framer-motion';
import "../components/check/check.css"
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import useAutocomplete from '@material-ui/lab/useAutocomplete';

//Antd
import { Spin, Alert, Space, Button, Modal, InputNumber, Table } from 'antd';

//Other
import { useCart } from "react-use-cart";

function Admin() {

    const [ip] = useContext(IpContext)
    const [data, setData] = useState({
        orders: [],
        loading: true
    });
    const {
        isEmpty,
        cartTotal,
        addItem,
        items,
        totalUniqueItems,
        updateItemQuantity,
        emptyCart,
    } = useCart();

    const [inputValue, setInputValue] = useState(0);
    const [inputValues, setInputValues] = useState(0);
    useEffect(() => {
        emptyCart()
    }, [])
    const [deleteOrder, setDelete] = useState({
        count: inputValue,
        isVisible: false,
        isPasswordIncorrect: false,

        isModalVisible: false,
        foods: ""
    });


    // const {
    //     getRootProps,
    //     getInputLabelProps,
    //     getInputProps,
    //     getListboxProps,
    //     getOptionProps,
    //     groupedOptions,
    // } = useAutocomplete({
    //     id: 'use-autocomplete-demo',
    //     options: data.orders,
    //     getOptionLabel: (option) => option.table.toString(),
    const handleDeleteOrder = (obj, index, id) => {
        setDelete({ isVisible: true })
        let tempObj = {
            id: id,
            name: obj.name,
            price: obj.price,
            quantitySingle: inputValues[id]
        };
        addItem(tempObj)

    }


    // setExpandedOrder({ ...expandedOrder, [index]: !expandedOrder[index] ? true : false });
    const handleSearchTable = async () => {
        const { data } = await axios.get(`${ip}/orders`)
        data.reverse()
        setData({
            orders: data,
            loading: false
        })
    }



    return (

        <div className="relative">
            <MobileView>
                <button
                    onClick={() => setDelete({ isModalVisible: true })}
                    className="pl w-4/12  focus:outline-none focus:ring-4 focus:ring-offset-indigo-800 focus:border-transparent transiton duration-500 rotate-90  z-20   transform"
                    style={{ height: "30px", position: "fixed", left: "-42px", top: "50%    " }}
                >
                    Оплачено
                </button>
            </MobileView>
            <BrowserView>
                <div style={{ zIndex: "9999999", position: "fixed", background: "white", top: "80", border: "1px solid blue", padding: "10px" }} className='w-2/12 h-2/12  left-2 top-10    '>
                    <div className='w-6/6 h-full	mt-2      '>
                        <p className="text-lg bold mb-0">Сумма: <span className="text-blue-600 font-bold">2000</span></p>
                        <p className="text-lg bold mb-0">Услуга: <span className="text-red-400 font-bold">10%</span></p>
                        <Divider style={{ background: "blue", marginTop: "50px" }} />
                        <p className="text-xl bold ">Общий: <span className="text-blue-600 font-bold">2100</span></p>

                    </div>
                </div>
            </BrowserView >
            <Modal
                title="Заказ оплачен?"
                onOk={""}
                onCancel={() => setDelete({ isModalVisible: false })}
                okText="Оплачен ✅ "
                cancelText="Закрыть"
                visible={deleteOrder.isModalVisible}
                height={100}
            >
                <div className='w-6/6 h-full	mt-2  z-10 bg-white   '>
                    <p className="text-lg bold mb-0">Сумма: <span className="text-blue-600 font-bold">2000</span></p>
                    <p className="text-lg bold mb-0">Услуга: <span className="text-red-400 font-bold">10%</span></p>
                    <Divider style={{ background: "blue", marginTop: "50px" }} />
                    <p className="text-xl bold ">Общий: <span className="text-blue-600 font-bold">2100</span></p>

                </div>
            </Modal>

            <center>

                {
                    deleteOrder.isVisible ?
                        <div style={{ position: "fixed", top: "10px", zIndex: "99999", width: "100%", }}>
                            <Grow in={true}>
                                <Alert
                                    message={totalUniqueItems + " заказов будут удалены продолжить?"}
                                    type="error"
                                    action={

                                        <Space direction="horizontal">

                                            <Button onClick={() => setDelete({ isModalVisible: true })} size="small" danger type="ghost">
                                                ДА
                                            </Button>
                                            <Button onClick={() => setDelete({ isVisible: false })} size="small" type="primary">
                                                НЕТ
                                            </Button>
                                        </Space>
                                    }
                                />
                            </Grow>
                        </div>
                        : null
                }

                <Container maxWidth="md">
                    <Grid className="pt-10" container>
                        <Grid item xs={6}>
                            <h1 className="inline text-lg">Стол: </h1>
                            <InputNumber
                                placeholder={"Номер"}
                                type="number"
                                size="small"
                                style={{ padding: "5px", width: "80px" }}
                                min="0"
                                max="500  "
                                onChange={(e) => setInputValue(parseInt(e))}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <motion.button
                                whileTap={{ scale: 1.1 }}
                                className="filterButton  "
                                style={{ padding: "5px", width: "80px" }}
                                onClick={handleSearchTable}
                            >
                                Поиск
                            </motion.button>                    </Grid>

                    </Grid>


                    {data.orders &&
                        data.orders.map((obj, index) => (
                            <div>
                                <Grow in={true}>
                                    <Card style={{ position: 'relative', width: "90%", }} className="m-4">

                                        <CardContent style={{ textAlign: "left" }} className="abosolute left-0">
                                            <h1 className="text-blue-600	 mb-0  text-lg font-bold">
                                                ЗАКАЗ #{data.orders.length - index}
                                            </h1>
                                            <h3 className="text-green-400  mt-0 text-xs font-bold ">
                                                {(Number(obj.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(obj.time.split(":")[1])) + " мин. назад" : (new Date().getHours() - Number(obj.time.split(":")[0])) + " часов назад"}                                             </h3>
                                            <h2 className="absolute top-4 right-4 text-blue-600 text-md font-bold ">
                                                Стол: {obj.table}
                                            </h2>
                                            <div className="ml-auto">
                                                {
                                                    data.orders[index].foods.map((foodObj, indx) => (
                                                        <div className='relative mb-0'>
                                                            <div key={indx}>
                                                                <span>
                                                                    <Grid className="pt-2" container>
                                                                        <Grid item xs={12}>
                                                                            <p className=" text-black text-md    mb-0 font-semibold	  uppercase">{foodObj.name}</p>
                                                                        </Grid>
                                                                        <div className="absolute -bottom-10 -right-5" >
                                                                            <InputNumber
                                                                                placeholder={0}
                                                                                type="number"
                                                                                size="small"
                                                                                style={{ position: "absolute", bottom: "12px", right: "34px", width: "40px", marginRight: "5px" }}
                                                                                min="1"
                                                                                max={foodObj.quantity}
                                                                                onChange={
                                                                                    (e) => setInputValues(
                                                                                        { [foodObj._id]: e })}
                                                                            />
                                                                            <IconButton style={{ position: "absolute", bottom: "0", right: "0", color: "red" }} onClick={() => handleDeleteOrder(foodObj, index, foodObj._id,)} className="bg-red-300 ">  <Delete fontSize="medium" />
                                                                            </IconButton>
                                                                        </div>
                                                                    </Grid>

                                                                    <Divider style={{ background: "black", }} /></span>
                                                                <h2 className=" text-yellow-400 text-md"> {foodObj.quantity}x </h2>


                                                            </div>


                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            </div>
                        ))}
                    {data.loading ? <div className="load"> <Spin tip="Загрузка" /> </div>
                        : null}

                </Container>
            </center>
        </div >

    )
}

export default Admin
