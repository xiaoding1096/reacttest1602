
import type { FormProps } from 'antd';
import { App, Button, Col, Form, Input, Row } from 'antd';
import { loginApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '@/components/context/app.context';


const LoginPage = () => {
    const [form] = Form.useForm()
    const {message, notification} = App.useApp()
    const {setUser, setIsAppLoading, setIsAuthenticated} = useCurrentApp()
    const navigation = useNavigate();
type FieldType = {
  email: string;
  password: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    
    const resLogin = await loginApi(values.email, values.password)
    if(resLogin.data){
        console.log(resLogin.data)
        message.success('Login Success')
        setUser(resLogin.data.user)
        setIsAuthenticated(true)
        localStorage.setItem("access_token", resLogin.data.access_token)
        navigation('/')

    }else{
        notification.error({
            message:'Login Error',
            description: resLogin.message
        })
    }
    setIsAppLoading(false)
};  



    return (
        <>
            <Row justify='center'>
                <Col xs={22} md={12} lg={8}>
                <fieldset style={{
                    margin: "50px auto",
                    borderRadius:"5px",
                    padding: "15px"
                    }}>
                        <legend style={{textAlign:"center", fontSize:"22px"}}>Login</legend>
                    <Form
                        layout='vertical'
                        name="basic"
                        form = {form}
                        onFinish={onFinish}
                        
                    >
                        <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}
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
                                    Login
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
export default LoginPage;