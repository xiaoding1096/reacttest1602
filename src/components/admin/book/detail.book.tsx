import { FORMAT_DATE_VN } from "@/services/helper"
import { Badge, Descriptions, Divider, Drawer, GetProp, Image, Upload, UploadFile, UploadProps } from "antd"
import dayjs from 'dayjs'
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
interface IProps {
    openViewDetail : boolean        
    setOpenViewDetail: (v: boolean )=> void
    dataViewDetail : IBookTable | null
    setDataViewDetail : (v: IBookTable | null) => void
}

const DetailBook = (props: IProps) => {
    const {openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail} = props
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if(dataViewDetail){
            let imgThumbnail: any = {}, imgSlider: UploadFile[] = []
            if(dataViewDetail.thumbnail){
                imgThumbnail = {
                    uid : uuidv4(),
                    name: dataViewDetail.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${dataViewDetail.thumbnail}`
                }
            }
            if(dataViewDetail.slider && dataViewDetail.slider.length > 0){
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`
                    })
                })
            }
             setFileList([imgThumbnail, ...imgSlider])
        }
    },[dataViewDetail])

     const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    return (
        <>
            <Drawer
                title="Book Detail"
                width={'75vw'}
                onClose={() => setOpenViewDetail(false)}
                open={openViewDetail}
            >
                <Descriptions title={`${dataViewDetail?.mainText} Detail`} bordered>
                    <Descriptions.Item label="ID" span={2}>{dataViewDetail?._id}</Descriptions.Item>
                    <Descriptions.Item label="MainText" span={2}>{dataViewDetail?.mainText}</Descriptions.Item>
                    <Descriptions.Item label="Author" span={2}>{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Price" span={2}>{Intl.NumberFormat('vi-VN',
                        { style: 'currency', currency: 'VND' }).format(dataViewDetail?.price ?? 0)}
                        </Descriptions.Item>
                    <Descriptions.Item label="Category" span={3}>
                        <Badge status="processing" text={dataViewDetail?.category}/>
                        </Descriptions.Item>
                    <Descriptions.Item label="Created At" span={2}>{dayjs(dataViewDetail?.createdAt).format(FORMAT_DATE_VN)}</Descriptions.Item>
                    <Descriptions.Item label="Update At" span={2}>{dayjs(dataViewDetail?.updatedAt).format(FORMAT_DATE_VN)}</Descriptions.Item>
                    </Descriptions>
                    <Divider orientation="left"> Book Image </Divider>
                    <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailBook;