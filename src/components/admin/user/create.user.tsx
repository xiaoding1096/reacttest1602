import { createUserApi } from "@/services/api";
import { App, Button, Form, FormProps, Input, Modal } from "antd";

interface IProps {
    openModalCreate : boolean,
    setOpenModalCreate: (v : boolean) => void
    refreshTable: () => void
}
 
type FieldType = {
    fullName: string,
    password: string,
    email: string,
    phone: string,
}

const CreateUser = (props : IProps) => {
     const {openModalCreate, setOpenModalCreate, refreshTable} = props
     const {message, notification} = App.useApp()
     const [form] = Form.useForm()
     
     const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        // to do 
        const resCreateNew = await createUserApi(values.fullName, values.password, values.email, values.phone)
        if(resCreateNew.data){
            message.success("Create New User Success")
            console.log(resCreateNew.data)
            refreshTable()
            form.resetFields()
            setOpenModalCreate(false)


        }else{
            notification.error({
                message: 'Create New User Error',
                description: resCreateNew.message
            })
        }
     }
    return (
        <>
            <Modal
                title="Create New User"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openModalCreate}
                onOk={() => {form.submit()}}
                onCancel={() => {(setOpenModalCreate(false))}}
                okText="Create New User"
            >
                <Form
                        layout='vertical'
                        name="Create New User"
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
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                        <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                        <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                        <Input />
                        </Form.Item>

                        
                    </Form>
            </Modal>
            
        </>
    )
}

export default CreateUser;