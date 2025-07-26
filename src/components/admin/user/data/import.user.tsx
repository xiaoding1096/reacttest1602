import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import Exceljs from 'exceljs'
import { Buffer } from 'buffer';
import { bulkCreateUserAPI } from "@/services/api";
import sampleFile from 'assets/template/user.xlsx?url'

interface IProps {
    openModalImport: boolean,
    setOpenModalImport: (v: boolean) => void
    refreshTable: () => void
}
interface IDataImport {
    fullName: string,
    email: string,
    phone: string
}
const ImportUser = (props: IProps) => {
    const {openModalImport, setOpenModalImport, refreshTable} = props
    const {message, notification} = App.useApp()
    const [dataImport, setDataImport] = useState<IDataImport[]>([])
    
    const propsUpload: UploadProps = {
  name: 'file',
//   action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  multiple: false,
  maxCount: 1,
    accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 

        customRequest ({file, onSuccess}) {
            setTimeout(() => {
                if(onSuccess) onSuccess("ok", file)
            }, 1000)
        },


  async onChange(info) {
    
    const {status} = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        console.log(info)
      message.success(`${info.file.name} file uploaded successfully`);
       
      if(info.fileList && info.fileList.length > 0){
          const file = info.fileList[0].originFileObj!
          // load file to buffer
          const workbook = new Exceljs.Workbook();
          // chuyển file thành nhị phân
          const arrayBuffer = await file.arrayBuffer()
          // biến nhị phân thành buffer vì excelJS chạy trên buffer của node
          const buffer = Buffer.from(arrayBuffer)
        // đọc toàn bộ nội dung Excel vào object workbook tức là toàn bộ nội dung của buffer được đưa lên biến workbook
        await workbook.xlsx.load(buffer);
       
        //convert file to json
        let jsonData: IDataImport[] = [];
        workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            // đặt tên cho dòng đầu tiên 
              let firstRow = sheet.getRow(1);
              if (!firstRow.cellCount) return;
              // đặt key = hàng đầu tiên 
              let keys = firstRow.values as any[];

            sheet.eachRow((row, rowNumber) => {
                if (rowNumber == 1) return;
                let values = row.values as any;
                let obj: any = {};
                for (let i = 1; i < keys.length; i++) {
                    obj[keys[i]] = values[i];
                }
                jsonData.push(obj);
            })

        })
         setDataImport(jsonData)
      }
        
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
 
  onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
};

const handleImport = async () => {
    const dataSubmit = dataImport.map((item)=> ({
        fullName: item.fullName,
        email: item.email,
        phone: item.phone,
        password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
    }))
    const resImport = await bulkCreateUserAPI(dataSubmit)
    if(resImport.data){
        notification.success({
            message: "Bulk Create Users",
            description: `Success = ${resImport.data.countSuccess}. Error=${resImport.data.countError}`
        })
        console.log(resImport.data)
        setOpenModalImport(false)
        setDataImport([])
        refreshTable()
    }
}
    return (
        <>
        <Modal
            title="Basic Modal"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openModalImport}
            onOk={() => handleImport()}
            onCancel={() => {
                setOpenModalImport(false)
                setDataImport([])
            }}
            
            okButtonProps={{disabled : dataImport.length > 0 ? false : true}}
            destroyOnClose={true}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                Support for a single or bulk upload.
                <a 
               // handle bubble situation
                    onClick={e => e.stopPropagation()}
                    href={sampleFile} 
                    download
                >Dowload Sample File</a>
                </p>
            </Dragger>
            <Table
                title={() => <span>Data Upload:</span>}
                dataSource={dataImport}
                columns={[
                    {dataIndex: 'fullName', title:'Display Name'},
                    {dataIndex: 'email', title:'Email'},
                    {dataIndex: 'phone', title:'Phone'}
                ]}
            />
        </Modal>
        </>
    )
}

export default ImportUser;