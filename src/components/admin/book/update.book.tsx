import { getCategoryApi, updateBookAPI, uploadFileApi } from "@/services/api";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Form, FormProps, GetProp, GetProps, Input, InputNumber, Modal, Row, Select, Upload, UploadFile, UploadProps } from "antd";
import { UploadChangeParam } from "antd/es/upload";
import { useEffect, useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { v4 as uuidv4 } from 'uuid';

interface IProps {
    openModalUpdateBook: boolean; 
    setOpenModalUpdateBook: (v: boolean) => void;
    updateBookData: IBookTable | null;
    setUpdateBookData: (v: IBookTable | null) => void;
    refreshTable: () => void
}
type FieldType = {
    _id: string,
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

const UpdateBook = (props : IProps) => {
    const {openModalUpdateBook, setOpenModalUpdateBook, updateBookData, setUpdateBookData, refreshTable} = props
    
    const [form] = Form.useForm()
    const [optionCategory, setOptionCategory] = useState<{
        label: string,
        value: string,
    }[]>([])

    useEffect(() => {
        if (updateBookData) {

    const arrThumbnail = [{
      uid: uuidv4(),
      name: updateBookData.thumbnail,
      status: 'done',
      url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${updateBookData.thumbnail}`,
    }] 

    const arrSlider = updateBookData?.slider?.map(item => {
        return {
            uid: uuidv4(),
            name: item,
            status: 'done',
            url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
        }
    })
    form.setFieldsValue({
            _id: updateBookData?._id,
            mainText: updateBookData?.mainText,
            author: updateBookData?.author,
            price: updateBookData?.price,
            quantity: updateBookData?.quantity,
            category: updateBookData?.category,
            thumbnail: arrThumbnail,
            slider: arrSlider,
        })
        setFileListThumbnail(arrThumbnail as any)
        setFileListSlider(arrSlider as any)
}
        

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
    },[updateBookData])

    const {message,notification} = App.useApp()
    const onFinish: FormProps['onFinish'] = async (values) => {
        console.log('fileListThumbnail:',fileListThumbnail, 'fileListSlider:', fileListSlider)
        const { _id, mainText, author, price, quantity, category } = values;
        const thumbnail = fileListThumbnail?.[0]?.name ?? '';
        const slider = fileListSlider?.map(item => item.name) ?? [];
         const res = await updateBookAPI(
            _id,
            mainText,
            author,
            price,
            quantity,
            category,
            thumbnail,
            slider
        );
        if(res && res.data){
            message.success('Update success')
            form.resetFields()
            setFileListSlider([])
            setFileListThumbnail([])
            setOpenModalUpdateBook(false)
            setUpdateBookData(null)
            refreshTable()
        }else {
            notification.error({
                message: 'Update Error',
                description: res.message
            })
        }
    }
    //-upload   function
    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
     const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]); 
     const [loadingSlider, setLoadingSlider] = useState<boolean>(false)
     const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false)
     

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
    }
    
    const handleChange= (info: UploadChangeParam, type : UserUploadType) => {
            
            if(info.file.status === 'uploading'){
                type === 'slider' ? setLoadingSlider(true) : setLoadingThumbnail(true)
                return
            }
            if(info.file.status === 'done'){
                
                type === 'slider' ? setLoadingSlider(false) : setLoadingThumbnail(false)
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
    
    const handleRemove = async(file: UploadFile, type: UserUploadType) => {
            if(type === 'thumbnail'){
                setFileListThumbnail([])
            }
            if(type === 'slider'){
                const newSlider = fileListSlider.filter(x => x.uid !== file.uid)
                setFileListSlider(newSlider)
            }
        }

        const normFile = (e: any) => {
            if (Array.isArray(e)) {
                return e;
            }
            return e?.fileList;       
        };


    //
    return (
        <>
            <Modal
            open={openModalUpdateBook}
            onOk={() => form.submit()}
            onCancel={()=> {
                setOpenModalUpdateBook(false)
                setFileListSlider([])
                setFileListThumbnail([])
            }}
            
            >
                <Form
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    form={form}
                >
                     <Form.Item<FieldType>
                    name="_id"
                    hidden
                    >
                    </Form.Item>

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
export default UpdateBook;