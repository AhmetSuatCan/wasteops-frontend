import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, InputNumber, Table, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFacility, CreateFacilityData, Facility } from '../hooks/useFacility';

export const Facilities: React.FC = () => {
    const { facilities, loading, error, fetchFacilities, createFacility, updateFacility, deleteFacility } = useFacility();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleCreateFacility = async () => {
        try {
            const values = await form.validateFields();
            await createFacility(values);
            setIsModalVisible(false);
            form.resetFields();
            message.success('Facility created successfully');
        } catch (error) {
            console.error('Create failed:', error);
            message.error('Failed to create facility');
        }
    };

    const handleEditFacility = async (id: string, data: CreateFacilityData) => {
        try {
            await updateFacility(id, data);
            setEditingFacility(null);
            message.success('Facility updated successfully');
        } catch (error) {
            console.error('Update failed:', error);
            message.error('Failed to update facility');
        }
    };

    const handleDeleteFacility = async (id: string) => {
        try {
            await deleteFacility(id);
            await fetchFacilities();
            message.success('Facility deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete facility');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Facility, b: Facility) => a.name.localeCompare(b.name),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            sorter: (a: Facility, b: Facility) => a.address.localeCompare(b.address),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Type',
            dataIndex: 'facility_type',
            key: 'facility_type',
            sorter: (a: Facility, b: Facility) => a.facility_type.localeCompare(b.facility_type),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
            sorter: (a: Facility, b: Facility) => a.capacity - b.capacity,
            render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Contact Info',
            dataIndex: 'contact_info',
            key: 'contact_info',
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text || '-'}</span>
        },
        {
            title: 'Operating Hours',
            dataIndex: 'operating_hours',
            key: 'operating_hours',
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text || '-'}</span>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Facility) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingFacility(record);
                            form.setFieldsValue(record);
                        }}
                        style={{ backgroundColor: '#169976', borderColor: '#169976' }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteFacility(record.id.toString())}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{ padding: '40px 24px 24px 24px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: 0,
                    padding: '8px 0',
                    borderBottom: '3px solid #169976',
                    display: 'inline-block'
                }}>
                    Facilities Management
                </h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingFacility(null);
                        setIsModalVisible(true);
                    }}
                    style={{
                        backgroundColor: '#169976',
                        borderColor: '#169976',
                        padding: '8px 24px',
                        height: 'auto',
                        fontSize: '16px',
                        marginRight: '16px'
                    }}
                >
                    Add Facility
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={facilities}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    position: ['bottomCenter'],
                    style: {
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%'
                    }
                }}
                style={{ fontSize: '16px' }}
                className="custom-table"
            />

            <Modal
                title={editingFacility ? "Edit Facility" : "Add New Facility"}
                open={isModalVisible || !!editingFacility}
                onOk={async () => {
                    try {
                        const values = await form.validateFields();
                        if (editingFacility) {
                            await handleEditFacility(editingFacility.id.toString(), values);
                        } else {
                            await handleCreateFacility();
                        }
                    } catch (error) {
                        console.error('Form validation failed:', error);
                    }
                }}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingFacility(null);
                    form.resetFields();
                }}
                okButtonProps={{ style: { backgroundColor: '#169976', borderColor: '#169976' } }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="facility_type"
                        label="Facility Type"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="recycling">Recycling</Select.Option>
                            <Select.Option value="treatment">Treatment</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="capacity"
                        label="Capacity"
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="contact_info"
                        label="Contact Info"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="operating_hours"
                        label="Operating Hours"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
