

import React, { useRef, useState } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, notification } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { deleteBookApi, getBookDataApi } from '@/services/api';
import DetailBook from './detail.book';
import CreateBook from './create.book';
import UpdateBook from './update.book';
import { Popconfirm } from 'antd/lib';

type TSearch = {
  mainText: string,
  author: string,
}

const BookTable = () => {
  const actionRef = useRef<ActionType>();
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IBookTable | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const [openModalUpdateBook, setOpenModalUpdateBook] = useState<boolean>(false)
  const [updateBookData,setUpdateBookData] = useState<IBookTable | null>(null)
  const handleDelete = async(id) => {
    const resDelete = await deleteBookApi(id)
    if(resDelete.data){
      message.success('Delete Success')
      refreshTable()

    }else {
      notification.error({
        message: 'Delete Error',
        description: resDelete.message
      })
    }
  }

  const refreshTable= () => {
    actionRef.current?.reload()
  }

  const [meta, setMeta] = useState({
            current: 1,
            pageSize: 5,
            pages: 0,
            total: 0
  })
  const columns: ProColumns<IBookTable>[] = [
    {
      title: 'ID',
      dataIndex: '_id',
      align: 'center',
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return (
          <>
            <a
              onClick={() => {
                setOpenViewDetail(true)
                setDataViewDetail(entity)
              }}
            >
              {entity._id}
            </a>
          </>
        )
      },
    },
    {
      title: 'Book Name',
      align: 'center',
      dataIndex: 'mainText'
    },
    {
      title: 'Category',
      dataIndex: 'category',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'Author',
      align: 'center',
      dataIndex: 'author',
    },
    {
      title: 'Price',
      align: 'center',
      dataIndex: 'price',
      hideInSearch: true,
      render: (dom, entity, index, action, schema) => {
        return (
          <>
            {new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.price)}
          </>
        )
      },
    },
    {
      title: 'Update Date',
      align: 'center',
      valueType: 'date',
      dataIndex: 'updatedAt',
      hideInSearch: true,
    },
    {
      title: 'Action',
      hideInSearch: true,
      align: 'center',
      render: (dom, entity, index, action, schema) => {
        return (
          <>
            <div style=
            {{ 
                display: 'flex', 
                justifyContent:"center", 
                gap:"30px"
              }}>
              <EditOutlined style=
                {{
                  color: 'green', fontSize:"22px"
                }}
                onClick={() => {
                  setOpenModalUpdateBook(true)
                  setUpdateBookData(entity)
                }}
                />

              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={() => handleDelete(entity._id)}
                okText="Delete"
                cancelText="No"
                placement='topLeft'
              >
                <DeleteOutlined style=
              {{
                color: 'red', 
                fontSize:"22px"
              }}/>
              </Popconfirm>
              

            </div>
          </>
        )
      },
    },
  ]
  return (
    <>
      <ProTable<IBookTable, TSearch>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        // console.log('params:', params);
       
        let query = ''
        if(params){
          query += `current=${params.current}&pageSize=${params.pageSize}`
          if(params.mainText){
            query += `&mainText=/${params.mainText}/i`
          }
          if(params.author){
            query += `&author=/${params.author}/i`
          }
        }
        if (sort && sort.createdAt) {
                        query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    }else {
                        query += `&sort=-createdAt`
                    }

         const resGetBookData = await getBookDataApi(query)
         if(resGetBookData.data){
           setMeta(resGetBookData?.data?.meta)
         }
        
        return {
          data: resGetBookData?.data?.result,
          "page": 1,
          "success": true,
          "total": resGetBookData?.data?.meta?.total
        };
      }}
      rowKey="_id"
      pagination={{
        current: meta?.current,
        pageSize: meta?.pageSize,
        total: meta?.total,
        showSizeChanger: true,
        showTotal: (total, range) => {return (
          <div>{range[0]} - {range[1]} on {total} rows</div>
          )},
      }}
      toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<ImportOutlined />}
                        type="primary"
                    >
                        Import
                    </Button>
                    ,
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => {
                          setOpenModalCreate(true)
                        }}
                    >
                        Add new
                    </Button>

                ]}
    />

    <DetailBook
       openViewDetail = {openViewDetail}        
       setOpenViewDetail ={setOpenViewDetail}
       dataViewDetail = {dataViewDetail}
       setDataViewDetail = {setDataViewDetail}
    />
    <CreateBook
    openModalCreate = {openModalCreate} 
    setOpenModalCreate = {setOpenModalCreate}
    refreshTable = {refreshTable}
    />

    <UpdateBook
    openModalUpdateBook= {openModalUpdateBook}
    setOpenModalUpdateBook={setOpenModalUpdateBook}
    updateBookData = {updateBookData}
    setUpdateBookData = {setUpdateBookData}
    refreshTable = {refreshTable}
    />

    </>
    
  );
};

export default BookTable;