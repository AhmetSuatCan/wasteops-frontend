import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Select, InputNumber, Table, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useFleet, CreateTruckData, Truck } from '../hooks/useFleet';

export const Fleet: React.FC = () => {
    const { trucks, loading, error, fetchTrucks, createTruck, updateTruck, deleteTruck } = useFleet();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTruck, setEditingTruck] = useState<Truck | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchTrucks();
    }, []);

    const handleCreateTruck = async () => {
        try {
            const values = await form.validateFields();
            await createTruck(values);
            setIsModalVisible(false);
            form.resetFields();
            message.success('Truck created successfully');
        } catch (error) {
            console.error('Create failed:', error);
            message.error('Failed to create truck');
        }
    };

    const handleEditTruck = async (id: string, data: CreateTruckData) => {
        try {
            await updateTruck(id, data);
            setEditingTruck(null);
            message.success('Truck updated successfully');
        } catch (error) {
            console.error('Update failed:', error);
            message.error('Failed to update truck');
        }
    };

    const handleDeleteTruck = async (id: string) => {
        try {
            await deleteTruck(id);
            message.success('Truck deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            message.error('Failed to delete truck');
        }
    };

    const columns = [
        {
            title: 'License Plate',
            dataIndex: 'license_plate',
            key: 'license_plate',
            sorter: (a: Truck, b: Truck) => a.license_plate.localeCompare(b.license_plate),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Type',
            dataIndex: 'car_type',
            key: 'car_type',
            sorter: (a: Truck, b: Truck) => a.car_type.localeCompare(b.car_type),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Capacity',
            dataIndex: 'capacity',
            key: 'capacity',
            sorter: (a: Truck, b: Truck) => a.capacity - b.capacity,
            render: (text: number) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: Truck, b: Truck) => a.status.localeCompare(b.status),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            sorter: (a: Truck, b: Truck) => a.location.localeCompare(b.location),
            render: (text: string) => <span style={{ fontSize: '16px' }}>{text}</span>
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Truck) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingTruck(record);
                            form.setFieldsValue(record);
                        }}
                        style={{ backgroundColor: '#169976', borderColor: '#169976' }}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTruck(record.id.toString())}
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
                    Fleet Management
                </h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingTruck(null);
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
                    Add Truck
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={trucks}
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
                title={editingTruck ? "Edit Truck" : "Add New Truck"}
                open={isModalVisible || !!editingTruck}
                onOk={async () => {
                    try {
                        const values = await form.validateFields();
                        if (editingTruck) {
                            await handleEditTruck(editingTruck.id.toString(), values);
                        } else {
                            await handleCreateTruck();
                        }
                    } catch (error) {
                        console.error('Form validation failed:', error);
                    }
                }}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingTruck(null);
                    form.resetFields();
                }}
                okButtonProps={{ style: { backgroundColor: '#169976', borderColor: '#169976' } }}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="license_plate"
                        label="License Plate"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="car_type"
                        label="Car Type"
                        rules={[{ required: true }]}
                    >
                        <Select>
                            <Select.Option value="truck">Truck</Select.Option>
                            <Select.Option value="van">Van</Select.Option>
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
                        name="status"
                        label="Status"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="location"
                        label="Location"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
