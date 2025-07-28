

import React, { useRef, useState } from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button } from 'antd';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import { getBookDataApi } from '@/services/api';
import DetailBook from './detail.book';
import CreateBook from './create.book';

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

  const handleDelete = () => {
    // const resDelete = await deleteBookApi()
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
                />
              <DeleteOutlined style=
              {{
                color: 'red', 
                fontSize:"22px"
              }}/>
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
    />
    </>
    
  );
};

export default BookTable;