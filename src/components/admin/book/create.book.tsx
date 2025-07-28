import { getCategoryApi } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Form, FormProps, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";

interface IProps {
    openModalCreate : boolean,
    setOpenModalCreate : (v: boolean) => void
}

type FieldType = {
    mainText: string,
    author: string,
    price: number,
    quantity: number,
    category: string,
    thumbnail: any,
    slider: any
}

const onFinish = () => {
    //todo
} 
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const CreateBook = (props : IProps) => {

    // variable for upload
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
     const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);   
    // --- 

    const {openModalCreate, setOpenModalCreate} = props
    const [form] = Form.useForm()
    const {message, notification} = App.useApp()
   
    const [optionCategory, setOptionCategory] = useState<{
        label: string,
        value: string,
    }[]>([])
    useEffect(() => {
        const getOptionCategoryData = async () => {
        const resGetCategory = await getCategoryApi()
        if(resGetCategory && resGetCategory.data){
            const d = resGetCategory.data.map(item => {
                return {label: item, value: item}
            })
            setOptionCategory(d)
        }
    }
    getOptionCategoryData()
    },[])
    

    //
    const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

      const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
        };

        const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
        };

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    
     // 

    const handleChange = (info: UploadChangeParam, type: "thumbnail" | "slider") => {
        if (info.file.status === 'uploading') {
            console.log('Check info:',info)
            type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
            return;
        }

        if (info.file.status === 'done') {
            console.log('Check info:',info)
            // Get this url from response in real world.
            type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
        }
    };

    const handleUploadFile: UploadProps['customRequest'] = ({ file, onSuccess, onError }) => {
        setTimeout(() => {
            if (onSuccess)
                onSuccess("ok");
        }, 1000);
    };
    
    
    //

     const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        
        
        console.log("values form: ", values, fileListThumbnail, fileListSlider); 
        console.log("values fileListThumbnail: ", fileListThumbnail)     
        console.log("values fileListSlider: ", fileListSlider)      
        
    };
  
    return (
        <>
            <Modal
                title="Create New Book"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={openModalCreate}
                onOk={() => onFinish}
                onCancel={()=>setOpenModalCreate(false)}
                okText='Create Book'
            >
              <Form
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item<FieldType>
                label="Book Name"
                name="mainText"
                rules={[{ required: true, message: 'Please input book\'s name!' }]}
                >
                <Input />
                </Form.Item>

                <Form.Item<FieldType>
                label="Author"
                name="author"
                rules={[{ required: true, message: 'Please input author!' }]}
                >
                <Input/>
                </Form.Item>
                <Row gutter={[10,0]}>
                <Col span={18}>
                    <Form.Item<FieldType>
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please input price!' }]}
                >
                    <InputNumber 
                        addonAfter="VND" 
                        style={{ width: '100%' }}
                        formatter={(value) => { 
                            if (!value) return '';
                            const num = Number(value) * 1000;
                            return new Intl.NumberFormat('vi-VN').format(num)
                        }}
                        parser={(value) => {
                            if(!value) return '';
                            const raw = value?.replace(/[^\d]/g, '') 
                            return raw ? Number(raw) / 1000 : ''
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item<FieldType>
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please input quantity!' }]}
                    >
                    <InputNumber style={{width : '100%'}}/>
                    </Form.Item>
                </Col>
                
                </Row>
                <Form.Item<FieldType>
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please input category!' }]}
                >
                <Select
                  
                    options={optionCategory}
                    />
                </Form.Item>
                <Form.Item<FieldType>
                label="Thumbnail"
                name="thumbnail"
                rules={[{ required: true, message: 'Please input thumbnail!' }]}
                ><Upload
                    listType="picture-card"
                    className="avatar-uploader"
                    maxCount={1}
                    multiple={false}
                    beforeUpload={beforeUpload}
                    customRequest={handleUploadFile}
                    onPreview={handlePreview}
                    
                    onChange={(info) => handleChange(info, 'thumbnail')}
                >
                    <div>
                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                </Upload>
                </Form.Item>
                <Form.Item<FieldType>
                label="Slide"
                name="slider"
                rules={[{ required: true, message: 'Please input slider!' }]}
                >
                    <Upload
                        multiple
                        listType="picture-card"
                        className="avatar-uploader"
                        customRequest={handleUploadFile}
                        beforeUpload={beforeUpload}
                        onChange={(info) => handleChange(info, 'slider')}
                        onPreview={handlePreview}
                    >
                        <div>
                            {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    </Upload>
                </Form.Item>  
            </Form>       
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
            </Modal>
        </>
    )
}

export default CreateBook;