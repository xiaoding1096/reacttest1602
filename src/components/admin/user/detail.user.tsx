import { Drawer } from "antd";

interface IProps {
    isOpenDetailUser : boolean,
    setIsOpenDetailUser : (v : boolean) => void
}

const DetailUser = (props: IProps) => {
    const {isOpenDetailUser, setIsOpenDetailUser} = props
    return (
        <>
        <Drawer
            title="User Detail"
            onClose={() => setIsOpenDetailUser(false)}
            open={isOpenDetailUser}
        >
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
        </Drawer>
        </>
    )
}

export default DetailUser;