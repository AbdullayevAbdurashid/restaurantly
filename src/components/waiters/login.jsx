import React from 'react'
import { Container } from '@material-ui/core'
import { Form, Checkbox } from 'antd';
import { Divider } from 'antd';
import useAuth from "../../context/useAuth";


function Login() {
    const { login, loading, error } = useAuth();

    const onFinish = (values) => {
        login(
            values.username,
            values.password
        );

    };

    return (
        <Container maxWidth="md" className="bg-gray-900  h-screen overflow-hidden"  >
            <div className="m-auto p-4 h-2 ">
                <h1 className="text-white font-medium text-3xl 	 antialiased"> Log in </h1>
                <Divider className="bg-white" />

                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    size={"large"}
                    requiredMark={"optional"}


                >
                    <Form.Item
                        label="Login"
                        name="username"
                        style={{ color: "white" }}
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <input className="rounded-xl border-gray-600  bg-gray-900 border-2 text-white p-2 w-full h-10 focus:outline-none  focus:border-green-300" />
                    </Form.Item>

                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <input type="password" className="rounded-xl border-gray-600  bg-gray-900 border-2 text-white p-2 w-full h-10 focus:outline-none  focus:border-green-300" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 0, span: 16 }}>
                        <Checkbox className="text-white">Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 32, span: 24 }}>
                        {loading ? <h1 className="text-white"> loading..</h1> : null}
                        <button className="w-full   disabled:bg-gray-300 bg-gradient-to-r  duration-500  transition from-green-400 h-10 rounded-xl focus:outline-none focus:ring-4 focus:ring-offset-indigo-800 focus:border-transparent transit to-blue-500  text-white" type="submit">
                            Submit
                        </button>
                    </Form.Item>
                </Form>
                {error ? <div className="bg-red-500 h-5 w-full"> <h1> Error incorrect login or password </h1></div> : null}
            </div>
        </Container>

    )
}

export default Login
