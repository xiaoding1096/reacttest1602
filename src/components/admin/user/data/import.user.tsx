import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import Exceljs from 'exceljs'

interface IProps {
    openModalImport: boolean,
    setOpenModalImport: (v: boolean) => void
}
interface IDataImport {
    fullName: string,
    email: string,
    phone: string
}
const ImportUser = (props: IProps) => {
    const {openModalImport, setOpenModalImport} = props
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
                if(onSuccess) onSuccess("ok")
            })
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
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await workbook.xlsx.load(buffer);

        //convert file to json
        let jsonData: IDataImport[] = [];
        workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
              let firstRow = sheet.getRow(1);
              if (!firstRow.cellCount) return;
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
  // handle bubble situation
  onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
};
    return (
        <>
        <Modal
            title="Basic Modal"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={openModalImport}
            onOk={() => {setOpenModalImport(false)}}
            onCancel={() => {setOpenModalImport(false)}}
        >
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                banned files.
                </p>
            </Dragger>
            <Table
                title={() => <span>Data Upload:</span>}
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