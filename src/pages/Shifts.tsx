import React, { useState } from 'react';
import { useShift } from '../hooks/useShift';
import { Table, Card, Form, Input, Select, DatePicker, Button, Space, Tag, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MapComponent } from '../components/Map';

const { Option } = Select;

const Shifts: React.FC = () => {
    const { shifts, routes, teams, loading, error, createShift } = useShift();
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRouteForMap, setSelectedRouteForMap] = useState<number | null>(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const handleSubmit = async (values: any) => {
        try {
            await createShift({
                name: values.name,
                route_id: values.route_id,
                team_id: values.team_id,
                start_time: values.start_time.toISOString()
            });
            form.resetFields();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error creating shift:', err);
        }
    };

    const columns: ColumnsType<typeof shifts[0]> = [
        {
            title: 'Vardiya Adı',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Rota',
            dataIndex: 'routeDetails',
            key: 'route',
            render: (routeDetails) => (
                routeDetails ? (
                    <Space direction="vertical" size="small">
                        <span className="font-medium">{routeDetails.name}</span>
                        <Tag color="blue">{routeDetails.nodes.length} konteyner</Tag>
                    </Space>
                ) : 'Bilinmeyen Rota'
            ),
        },
        {
            title: 'Ekip',
            dataIndex: 'teamDetails',
            key: 'team',
            render: (teamDetails) => (
                teamDetails ? (
                    <Space direction="vertical" size="small">
                        <span className="font-medium">{teamDetails.name}</span>
                        <Tag color={teamDetails.status === 'active' ? 'green' : 'orange'}>
                            {teamDetails.status === 'active' ? 'Aktif' : 'Pasif'}
                        </Tag>
                    </Space>
                ) : 'Bilinmeyen Ekip'
            ),
        },
        {
            title: 'Başlangıç Zamanı',
            dataIndex: 'start_time',
            key: 'start_time',
            render: (start_time) => dayjs(start_time).format('DD.MM.YYYY HH:mm'),
        },
        {
            title: 'Durum',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.end_time ? 'green' : 'blue'}>
                    {record.end_time ? 'Tamamlandı' : 'Başlamadı'}
                </Tag>
            ),
        },
        {
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => record.routeDetails && setSelectedRouteForMap(record.routeDetails.id)}
                    style={{
                        backgroundColor: 'var(--color-brandGreen)',
                        borderColor: 'var(--color-brandGreen)'
                    }}
                >
                    Rotayı Göster
                </Button>
            ),
        },
    ];

    if (error) return <div>Hata: {error}</div>;

    return (
        <div className="container mx-auto p-4 mt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Vardiya Yönetimi</h1>
                <Button
                    type="primary"
                    onClick={showModal}
                    size="large"
                    className="text-base font-semibold h-12 px-6"
                    style={{
                        backgroundColor: 'var(--color-brandGreen)',
                        borderColor: 'var(--color-brandGreen)'
                    }}
                >
                    Yeni Vardiya Oluştur
                </Button>
            </div>

            {/* Create Shift Modal */}
            <Modal
                title="Yeni Vardiya Oluştur"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Vardiya Adı"
                        rules={[{ required: true, message: 'Lütfen vardiya adını girin' }]}
                    >
                        <Input placeholder="Vardiya adını girin" />
                    </Form.Item>

                    <Form.Item
                        name="route_id"
                        label="Rota"
                        rules={[{ required: true, message: 'Lütfen bir rota seçin' }]}
                    >
                        <Select placeholder="Rota seçin">
                            {routes.map((route) => (
                                <Option key={route.id} value={route.id}>
                                    {route.name} ({route.nodes.length} konteyner)
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="team_id"
                        label="Ekip"
                        rules={[{ required: true, message: 'Lütfen bir ekip seçin' }]}
                    >
                        <Select placeholder="Ekip seçin">
                            {teams.map((team) => (
                                <Option key={team.id} value={team.id}>
                                    {team.name} ({team.status === 'active' ? 'Aktif' : 'Pasif'})
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="start_time"
                        label="Başlangıç Zamanı"
                        rules={[{ required: true, message: 'Lütfen başlangıç zamanını seçin' }]}
                    >
                        <DatePicker
                            showTime
                            format="DD.MM.YYYY HH:mm"
                            className="w-full"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Space>
                            <Button onClick={handleCancel}>
                                İptal
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{
                                    backgroundColor: 'var(--color-brandGreen)',
                                    borderColor: 'var(--color-brandGreen)'
                                }}
                            >
                                Vardiya Oluştur
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Shifts List */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={shifts}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Toplam ${total} vardiya`
                    }}
                    onRow={(record) => ({
                        style: record.routeDetails?.id === selectedRouteForMap ? {
                            backgroundColor: 'rgba(22, 153, 118, 0.1)'
                        } : {}
                    })}
                />
            </Card>

            {/* Route Map */}
            {selectedRouteForMap && (
                <Card className="mt-6">
                    <div className="h-[500px]">
                        <MapComponent
                            mode="route"
                            containers={[]}
                            selectedContainers={[]}
                            selectedRoute={routes.find(r => r.id === selectedRouteForMap) || null}
                        />
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Shifts;
