import React, { useState, useEffect, useContext } from 'react'
import { Input, Button, Table, Space, Popconfirm, message } from 'antd'
import CreatModal from './create-tenant'
import api from '../../../api/api'
import './Index.less'
import { AppStoreContext } from '../../../stores'

export default function Index() {
    const [page, setPage] = useState({})//分页条件
    const [listData, setListData] = useState({})//列表数据
    const [detailData, setDetailData] = useState({})//具体项的查询条件
    const [visible, setVisible] = useState(false)//编辑与创建的模态框
    const [query, setQuery] = useState("")//搜索值
    const [loading, setLoading] = useState("")//table加载
    const appStore = useContext(AppStoreContext)
 
    // 获取数据
    useEffect(() => {
        setLoading(true)
        getUserData()
        // setListData(demoData.data)
    }, [page, query, appStore.tenant])

    // 获取用户数据
    const getUserData = () => {
        api.getUserTable({ ...page, query }).then(res => {
            if (res && res.status === 200) {
                setListData(res.data)
                setLoading(false)
            }
        })
    }
    // 默认排序
    /*const reverseDataWithUpdateTime = useMemo(() => {
        if (listData.records) return listData.records.sort((a, b) => (+b.create_time.split("/").join("")) - (+a.create_time.split("/").join("")))
        return []
    }, [listData])*/

    // 创建用户
    const createHandle = () => {
        setDetailData({})
        setVisible(true)
    }
    // 分页数据
    const pageChange = (params) => {
        setPage({ page_no: params.current, page_size: params.pageSize })
    }
    // 编辑按钮
    const changeHandle = (value) => {
        setDetailData(value)
        setVisible(true)
    }
    // 删除
    function confirm(value) {
        api.deleteUser(value.id).then(res => {
            if (res && res.status === 200) {
                message.success('删除成功');
                getUserData()
            } else {
                message.success("删除失败")
            }
        })
    }
    // 取消删除
    function cancel() {
        message.error('取消删除')
    }
    // 搜索值
    function searchHandle(value) {
        setQuery(value)
    }
    const columns = [
        {
            title: '用户账号',
            dataIndex: 'user_name',
            align: "center"
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            align: "center",
        },

        {
            title: '邮箱',
            dataIndex: 'email',
            align: "center"
        },
        {
            title: '手机',
            dataIndex: 'phone',
            align: "center"
        },
        {
            title: '描述',
            dataIndex: 'description',
            align: "center"
        },
        {
            title: '操作',
            align: "center",
            width: 200,
            fixed: "right",
            render: (tag) => (
                <Space size="middle">
                    <Button onClick={() => changeHandle(tag)}>编辑</Button>
                    <Popconfirm
                        title={`你确定要删除租户账号${tag.user_name}吗?`}
                        onConfirm={() => confirm(tag)}
                        onCancel={cancel}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type='ghost' danger>删除</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <div className='graphData_wrapper' style={{ width: "100%", height: "calc(100vh - 130px)" }}>
            <div className='topDiv'>
                <Input.Group compact className='inputBox'>
                    <Input.Search allowClear style={{ width: '100%' }} placeholder='用户账号' onSearch={searchHandle} />
                </Input.Group>
                <Button type='primary' className='addBtn' onClick={createHandle}>添加用户</Button>
            </div>
            <Table
                columns={columns}
                dataSource={listData.records}
                rowKey={'id'}
                scroll={{ x: 1500 }}
                current={listData.current}
                total={listData.total}
                loading={loading}
                pagination={
                    {
                        pageSizeOptions: ['5', '10', '15', '20'],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        showSizeChanger: true
                    }
                }
                onChange={pageChange}
            />
            <CreatModal
                getUserData={getUserData}
                visible={visible}
                setVisible={setVisible}
                detailData={detailData}>
            </CreatModal>
        </div>
    )
}
React.memo(Index)