import { registerApi } from "@/services/api";
import { App, Button, Col, Form, FormProps, Input, Row } from "antd";
import { useNavigate } from "react-router-dom";

interface FieldType {
    fullName: string;
    email: string;
    password: string;
    phone: string;
}
const RegisterPage = () => {
    const [form] = Form.useForm()
    const {message,notification} = App.useApp()
    const navigation = useNavigate()
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const resRegister = await registerApi(values.fullName, values.email, values.password, values.phone)
        if(resRegister.data){
            console.log(resRegister.data)
            message.success('Register Success')
            navigation('/login')
        }else{
            notification.error({
                message: "Register Error",
                description:resRegister.message
            })
        }

    }

    return (
        <>
            <Row justify='center'>
                <Col xs={22} md={12} lg={8}>
                <fieldset style={{
                    margin: "50px auto",
                    borderRadius:"5px",
                    padding: "15px"
                    }}>
                        <legend style={{textAlign:"center", fontSize:"22px"}}>Register</legend>
                    <Form
                        layout='vertical'
                        name="basic"
                        form = {form}
                        onFinish={onFinish}
                    >
                        <Form.Item<FieldType>
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item label={null}>
                            <div style={{
                                display:"flex",
                                justifyContent:"center",
                                gap:"50px"
                            }}>
                                <Button type="primary" href='/' size='large'>
                                    Home
                                </Button>
                                <Button type="primary" htmlType="submit" size='large'>
                                    Register
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </fieldset>
                    
                </Col>
            </Row>
        </>
    )
}
export default RegisterPage;