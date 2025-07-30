import { getCategoryApi, uploadFileApi } from "@/services/api";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Form, FormProps, GetProp, Image, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

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

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type UserUploadType = 'thumbnail' | 'slider'

const CreateBook = (props : IProps) => {
    const {openModalCreate, setOpenModalCreate} = props
    const [form] = Form.useForm()
   const {message} = App.useApp()
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
    // variable for upload
     const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false)
    const [loadingSlider, setLoadingSlider] = useState<boolean>(false)
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
    const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);   

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


     const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        };   

    const handleChange= (info: UploadChangeParam, type : UserUploadType) => {
        
        if(info.file.status === 'uploading'){
            type === 'slider' ? setLoadingSlider(true) : setLoadingThumbnail(true)
            return
        }
        if(info.file.status === 'done'){
            
            type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false)
        }
    }

    

    const handleRemove = async(file: UploadFile, type: UserUploadType) => {
        if(type === 'thumbnail'){
            setFileListThumbnail([])
        }
        if(type === 'slider'){
            const newSlider = fileListSlider.filter(x => x.uid !== file.uid)
            setFileListSlider(newSlider)
        }
    }

    const handleUploadFile = async (options: RcCustomRequestOptions, type: UserUploadType) => {
            const {onSuccess} = options;
            const file = options.file as UploadFile;
            const res = await uploadFileApi(file, 'book')
            console.log('API response:', res);
            if(res && res.data){
                const uploadedFile: any = {
                    uid: file.uid,
                    name: res.data.fileUploaded,
                    status: 'done',
                    url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${res.data.fileUploaded}`
                }
                if(type === 'thumbnail'){
                    console.log(res)
                    setFileListThumbnail([{...uploadedFile}])
                    
                } else {
                    console.log(res)
                    setFileListSlider((prevState) => [...prevState, {...uploadedFile}])
                }
                
                if(onSuccess){
                     onSuccess('ok')
                   

                }else{
                    message.error(res.message)
                }
            }
        }

        const normFile = (e: any) => {
            if (Array.isArray(e)) {
                return e;
            }
            return e?.fileList;       
        };

    // --- 

    
    
  
 

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
                onOk={() => form.submit()}
                onCancel={()=>{
                    form.resetFields()
                    setFileListSlider([])
                    setFileListThumbnail([])
                    setOpenModalCreate(false)
                }}
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
                valuePropName="fileList"
                getValueFromEvent={normFile}
                >
                         <Upload
                            maxCount={1}
                            listType="picture-card"
                            fileList={fileListThumbnail}
                            onPreview={handlePreview}
                            onChange={(info) => handleChange(info, 'thumbnail')}
                            customRequest={(options) => {handleUploadFile(options,'thumbnail')}}
                            onRemove={(file)=> {handleRemove(file,'thumbnail')}}

                        >
                            <div>

                            {loadingThumbnail ? <LoadingOutlined/> : <PlusOutlined/>}
                             <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>

                        </Form.Item>
                <Form.Item<FieldType>
                label="Slide"
                name="slider"
                rules={[{ required: true, message: 'Please input slider!' }]}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                >
                       <Upload
                            multiple
                            listType="picture-card"
                            className="avatar-uploader"
                            fileList={fileListSlider}
                            customRequest={(options) => handleUploadFile(options, 'slider')}
                            onPreview={handlePreview}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleChange(info, 'slider')}
                            onRemove={(file) => {handleRemove(file, 'slider')}}
                            
                        >
                            <div>
                                {loadingSlider ? <LoadingOutlined/> : <PlusOutlined/>}
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>

                        </Upload>
                      
                </Form.Item>  
            </Form>                 
                
            </Modal>
        </>
    )
}

export default CreateBook;