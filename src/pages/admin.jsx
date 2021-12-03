import React, { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { IpContext } from '../context/ipProvider';
import clsx from 'clsx';
import { InputNumber } from 'antd';
//MUI
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from "@material-ui/core/Divider";
import Grow from "@material-ui/core/Grow";
import { Container } from '@material-ui/core';
import { motion } from 'framer-motion';
import "../components/check/check.css"
import { IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import useAutocomplete from '@material-ui/lab/useAutocomplete';

//Antd
import { Spin, Alert, Space, Button, Modal, Input } from 'antd';

//Other

function Admin() {
    const [ip] = useContext(IpContext)
    const [data, setData] = useState({
        orders: [],
        loading: true

    });
    const [inputValue, setInputValue] = useState(0);
    const [inputValues, setInputValues] = useState("");

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
    // });
    const handleDeleteOrder = (index, id, inputVal) => {
        console.log(deleteOrder.count + inputValue)
        setDelete(
            {
                ...deleteOrder,
                count: deleteOrder.count + inputVal,
                foods: id,
                isVisible: true

            })
    }
    // setExpandedOrder({ ...expandedOrder, [index]: !expandedOrder[index] ? true : false });
    const handleSearchTable = async () => {
        const { data } = await axios.get(`${ip}/orders`)
        setData({
            orders: data,
            loading: false
        })


    }
    return (
        <div>
            <Modal
                title="Parol"
                onOk={""}
                onCancel={() => setDelete({ isModalVisible: false })}
                okText="Tasdiqlash"
                cancelText="Orqaga"
                visible={deleteOrder.isModalVisible}
                height={100}
            >
                <p>Parolni Kiriting</p>

                {deleteOrder.isPasswordIncorrect ? (
                    <h4 className="errorInput" style={{ color: "red" }}>
                        Parol Notogri{" "}
                    </h4>
                ) : null}

                <Input.Password
                    style={{ width: "300px" }}
                    onChange={(e) => setInputValues(e.target.value)}
                    placeholder="Parolni kiritng"
                />
            </Modal>
            <center>

                {
                    deleteOrder.isVisible ?
                        <div style={{ position: "fixed", top: "10px", zIndex: "99999", width: "100%", }}>
                            <Grow in={true}>
                                <Alert
                                    message={deleteOrder.count + " заказов будут удалены продолжить?"}
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
                <Container maxWidth="lg">
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
                                className="filterButton"
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
                                    <Card style={{ position: 'relative', width: "70%", }} className="m-4">

                                        <CardContent style={{ textAlign: "left" }} className="abosolute left-0">
                                            <h1 className="text-blue-600	 mb-0  text-xl font-bold">
                                                ЗАКАЗ #{data.orders.length - index}
                                            </h1>
                                            <h3 className="text-green-400  mt-0 text-sm font-bold ">
                                                {(Number(obj.time.split(":")[0]) - new Date().getHours()) === 0 ? (new Date().getMinutes() - Number(obj.time.split(":")[1])) + " мин. назад" : (new Date().getHours() - Number(obj.time.split(":")[0])) + " часов назад"}                                             </h3>
                                            <h2 className="absolute top-4 right-4 text-blue-600 text-lg font-bold ">
                                                Стол: {obj.table}
                                            </h2>
                                            <h3 className="text-blue-600 absolute bottom-4 right-4 text-lg font-medium">
                                                Всего: {data.orders[index].foods.length}
                                            </h3>
                                            <div className="ml-auto">
                                                {
                                                    data.orders[index].foods.map((foodObj, indx) => (
                                                        <div className='relative mb-0'>
                                                            <div key={indx}>
                                                                <span>
                                                                    <Grid className="pt-2" container>
                                                                        <Grid item xs={10}>
                                                                            <p className=" text-black text-lg    mb-0 font-semibold	  uppercase">{foodObj.name}</p>
                                                                        </Grid>
                                                                        <Grid item xs={2}>
                                                                            <InputNumber
                                                                                placeholder={1}
                                                                                type="number"
                                                                                size="small"
                                                                                style={{ width: "40px", marginRight: "5px" }}
                                                                                min="1"
                                                                                max={data.orders[index].foods.length}
                                                                                onChange={
                                                                                    (e) => setInputValue(e)}
                                                                            />
                                                                            <IconButton style={{ marginBottom: "7px", color: "red" }} onClick={() => handleDeleteOrder(index, foodObj._id, inputValue)} className="bg-red-300 ">  <Delete fontSize="medium" />
                                                                            </IconButton>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Divider style={{ background: "black", }} /></span>
                                                                <h2 className=" text-yellow-400 text-xl"> 2x </h2>


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
