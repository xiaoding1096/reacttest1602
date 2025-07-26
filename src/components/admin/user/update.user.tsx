import { updateUserApi } from "@/services/api"
import { Form, FormProps, Input, message, Modal, notification } from "antd"
import { useEffect } from "react"

interface IProps {
    openModalUpdate: boolean,
    setOpenModalUpdate: (v: boolean) => void
    dataUpdate: IUserTable | null,
    setDataUpdate: (v : IUserTable | null) => void
    refreshTable: () => void
}

type FieldType = {
    _id: string,
    fullName: string,
    email: string
    phone: string,
}

const UpdateUser = (props: IProps) => {
    const {openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate, refreshTable} = props
    useEffect(() => {
        if(dataUpdate){
            form.setFieldsValue({
                _id: dataUpdate._id,
                fullName: dataUpdate.fullName,
                email: dataUpdate.email,
                phone: dataUpdate.phone
            })
        }
    },[dataUpdate])
    const [form] = Form.useForm()
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        // todo

        const resUpdate = await updateUserApi(values._id, values.fullName, values.phone )
        if(resUpdate.data){
            message.success('Update User Success')
            form.resetFields()
            setDataUpdate(null)
            setOpenModalUpdate(false)
            refreshTable()
        }else{
            notification.error({
                message: "Update User Error",
                description: resUpdate.message
            })
        }
    }
    return (
        <>
            <Modal
                title="Update User"
                open={openModalUpdate}
                onOk={() => {form.submit()}}
                onCancel={() => {(setOpenModalUpdate(false))}}
                okText="Update"
            >
                <Form
                        layout='vertical'
                        name="Create New User"
                        form = {form}
                        onFinish={onFinish}
                    >
                        

                         <Form.Item<FieldType>
                        label="ID"
                        name="_id"
                        hidden
                        >
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        >
                        <Input disabled/>
                        </Form.Item>

                        <Form.Item<FieldType>
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
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

export default UpdateUser;