import { getUsersAPI } from '@/services/api';
import { dateRangeValidate } from '@/services/helper';
import { DeleteOutlined, EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Space, Tag } from 'antd';
import { useRef, useState } from 'react';
import DetailUser from './detail.user';
import CreateUser from './create.user';
import ImportUser from './data/import.user';



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
                        
                        <EditOutlined style={{color: "green"}}/>
                        <DeleteOutlined style={{color: "red"}}/>
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
            />
        </>
    );
};

export default TableUser;