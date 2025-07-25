import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import {FORMAT_DATE_VN} from "services/helper"
interface IProps {
    openViewDetail : boolean,
    setOpenViewDetail : (v : boolean) => void
    dataViewDetail : IUserTable | null
    setDataViewDetail : (v: IUserTable | null) => void
}

const DetailUser = (props: IProps) => {
    const {openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail} = props
    console.log(dataViewDetail)
    const avatar = `${import.meta.env.VITE_URL_BACKEND}/images/avatar/${dataViewDetail?.avatar}`
    return (
        <>
        <Drawer
            title="User Detail"
            width={"50vw"}
            onClose={() => setOpenViewDetail(false)}
            open={openViewDetail}
        >
            
            <Descriptions title="User Info" bordered>
                <Descriptions.Item label="ID" span={3}>{dataViewDetail?._id}</Descriptions.Item>
                <Descriptions.Item label="Full Name" span={2}>{dataViewDetail?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Avatar" span={2}><Avatar size={40} src={avatar}/></Descriptions.Item>
                
                <Descriptions.Item label="Email" span={3}>{dataViewDetail?.email}</Descriptions.Item>
                <Descriptions.Item label="Phone" span={3}>{dataViewDetail?.phone}</Descriptions.Item>
                <Descriptions.Item label="Role" span={3}>
                    <Badge status="processing" text={dataViewDetail?.role} />
                </Descriptions.Item>
                <Descriptions.Item label="Created At" span={2}>{dayjs(dataViewDetail?.createdAt).format(FORMAT_DATE_VN)}</Descriptions.Item>
                <Descriptions.Item label="Updated At" span={2}>{dayjs(dataViewDetail?.updatedAt).format(FORMAT_DATE_VN)}</Descriptions.Item>
            </Descriptions>
        </Drawer>
        </>
    )
}

export default DetailUser