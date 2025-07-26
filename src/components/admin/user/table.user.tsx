import { deleteUserApi, getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, message, notification, Popconfirm, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';
import { CSVLink } from 'react-csv';
import UpdateUser from './update.user';



type TSearch = {
    fullName: string,
    email: string,
    createdAt: Date,
    createdAtRange: Date,

}

const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false)
    const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null)
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false)
    const [openModalImport, setOpenModalImport] = useState<boolean>(false)
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[] | []>([])
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false)
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null)

    const handleDelete = async (id : string) => {
        const resDelete = await deleteUserApi(id)
        if(resDelete.data){
            message.success("Delete User Success")
            console.log(resDelete)
            refreshTable()
        }
    }
    const refreshTable = () => {
         actionRef.current?.reload();
    }
    const [meta, setMeta] = useState({
        current:1,
        pageSize:5,
        pages:0,
        total:0,
    })

    const columns: ProColumns<IUserTable>[] = [
    {
        title: 'ID',
        align: 'center',
        dataIndex: '_id',
        hideInSearch: true,
        render: (dom, entity, index, action, schema) => {
            return (
                <a onClick={() => {
                    setOpenViewDetail(true)
                    setDataViewDetail(entity)
                }
            }>{entity._id}</a>
            )
        },
    },
     {
        title: 'Full Name',
        dataIndex: 'fullName',
        align: 'center',
        copyable: true
    },
    {
        title: 'Email',
        dataIndex: 'email',
        align: 'center',
        copyable: true
    },
    {
        title: 'Created At',
        align: 'center',
        dataIndex: 'createdAt',
        sorter: true,
        valueType: 'date',
        hideInSearch: true
    },
    {
        title: 'Created At',
        align: 'center',
        dataIndex: '_id',
        valueType: 'dateRange',
        hideInTable: true
    },
    
    {
        title: 'Option',
        hideInSearch: true,
        align: 'center',
        render: (dom, entity, index, action, schema) => {
            return (
                <>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '30px'}}>
                        
                        <EditOutlined style={{color: "green"}} onClick={() => {
                            setOpenModalUpdate(true)
                            setDataUpdate(entity)
                        }}/>
                        <Popconfirm
                            title="Delete the task"
                            description="Are you sure to delete this task?"
                            onConfirm={() => handleDelete(entity._id)}
                            placement= "topLeft"
                            okText="Delete"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{color: "red"}} />
                        </Popconfirm>
                        
                    </div>
                </>
            )
        },
    },
];


    return (
        <>

            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    console.log("params:",params);
                    
                    let query = ''
                    if(params){
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if(params.fullName){
                        query += `&fullName=/${params.fullName}/i`
                            }   
                        if(params.email){
                        query += `&email=/${params.email}/i`    
                            }
                        let createDateRange = dateRangeValidate(params.createdAtRange)
                        if(createDateRange){
                            query += `&createAt>=${createDateRange[0]}&createAt<=${createDateRange[1]}`
                        }
                    }
                    if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }else {
                        query += `&sort=-createdAt`
                    }
                    

                    const resGetUserData = await getUsersAPI(query);
                    if(resGetUserData.data){
                        setMeta(resGetUserData?.data?.meta)
                        setCurrentDataTable(resGetUserData?.data?.result ?? [])
                    }
                    
                    // const data = await (await fetch('https://proapi.azurewebsites.net/github/issues')).json()
                    return {
                        // data: data.data,
                        data: resGetUserData?.data?.result,
                        "page": 1,
                        "success": true,
                        "total": resGetUserData?.data?.meta?.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                    showTotal: (total, range) => {return (<div>  {range[0]} - {range[1]} on {total} rows</div>)},
                    
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ExportOutlined/>}
                        type="primary"
                    >
                        <CSVLink
                            data={currentDataTable}
                            filename='export-user.csv'
                        >
                            Export
                        </CSVLink>
                    </Button>,
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        onClick={() => {
                           setOpenModalImport(true)
                        }}
                        type="primary"
                    >
                        Import
                    </Button>
                    ,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                           setOpenModalCreate(true)
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
            <DetailUser
            openViewDetail = {openViewDetail}
            setOpenViewDetail = {setOpenViewDetail}
            dataViewDetail = {dataViewDetail}
            setDataViewDetail = {setDataViewDetail}
            />
            <CreateUser
            openModalCreate = {openModalCreate}
            setOpenModalCreate = {setOpenModalCreate}
            refreshTable = {refreshTable}
            />
            <ImportUser
                openModalImport = {openModalImport}
                setOpenModalImport= {setOpenModalImport}
                refreshTable= {refreshTable}
            />
            <UpdateUser
                openModalUpdate = {openModalUpdate}
                setOpenModalUpdate = {setOpenModalUpdate}
                dataUpdate = {dataUpdate}
                setDataUpdate = {setDataUpdate}
                refreshTable = {refreshTable}
            />
        </>
    );
};

export default TableUser;