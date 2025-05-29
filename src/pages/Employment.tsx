import React, { useEffect, useState } from 'react';
import { useEmployment } from '../hooks/useEmployment';
import { Table, Button, Modal, Typography, Alert, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface User {
    id: string;
    name: string;
    gender: string;
    email: string;
    age: number;
    phone_number: string;
    address: string;
}

interface Employee {
    id: number;
    user: User;
    start_date: string;
    created_at: string;
}

const Employment: React.FC = () => {
    const { employees, loading, error, fetchEmployees, terminateEmployment } = useEmployment();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleTerminateClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmTermination = async () => {
        if (selectedEmployee) {
            await terminateEmployment(selectedEmployee.user.id);
            setIsConfirmModalOpen(false);
            setSelectedEmployee(null);
        }
    };

    const columns = [
        {
            title: 'Çalışan Adı',
            dataIndex: ['user', 'name'],
            key: 'name',
            render: (text: string) => (
                <Typography.Text strong style={{ color: '#169976', fontSize: '16px' }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: 'Email',
            dataIndex: ['user', 'email'],
            key: 'email',
            render: (text: string) => (
                <Typography.Text style={{ fontSize: '16px' }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: 'Telefon',
            dataIndex: ['user', 'phone_number'],
            key: 'phone',
            render: (text: string) => (
                <Typography.Text style={{ fontSize: '16px' }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: 'Başlangıç Tarihi',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (date: string) => (
                <Typography.Text style={{ fontSize: '16px' }}>
                    {format(new Date(date), 'dd MMMM yyyy', { locale: tr })}
                </Typography.Text>
            ),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_: any, record: Employee) => (
                <Space>
                    <Button
                        type="primary"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={() => handleTerminateClick(record)}
                        size="large"
                    >
                        Çıkış
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ width: '100%', padding: '2rem' }}>
            <Typography.Title
                level={2}
                style={{
                    marginBottom: '2rem',
                    borderBottom: '3px solid #169976',
                    paddingBottom: '0.5rem',
                    display: 'inline-block',
                }}
            >
                Çalışan Yönetimi
            </Typography.Title>

            {error && (
                <Alert
                    message="Hata"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '1rem' }}
                />
            )}

            <Table
                columns={columns}
                dataSource={employees}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showTotal: (total) => `Toplam ${total} çalışan`,
                }}
                locale={{
                    emptyText: 'Hiç çalışan yok',
                }}
                style={{
                    backgroundColor: '#fafafa',
                    borderRadius: '8px',
                }}
                className="custom-table"
            />

            <style>
                {`
                    .custom-table .ant-table-thead > tr > th {
                        background-color: #f5f5f5;
                        font-size: 16px;
                        font-weight: 600;
                        padding: 16px;
                    }
                    .custom-table .ant-table-tbody > tr > td {
                        padding: 16px;
                        background-color: #ffffff;
                    }
                    .custom-table .ant-table-tbody > tr:hover > td {
                        background-color: #f0f9f4 !important;
                    }
                `}
            </style>

            <Modal
                title="Çalışanı Çıkar"
                open={isConfirmModalOpen}
                onOk={handleConfirmTermination}
                onCancel={() => setIsConfirmModalOpen(false)}
                okText="Çalışanı Çıkar"
                cancelText="İptal"
                okButtonProps={{ danger: true }}
            >
                <Typography.Paragraph>
                    {selectedEmployee ? selectedEmployee.user.name : ''} isimli çalışanı çıkarmak istediğinizden emin misiniz?
                    Bu işlem geri alınamaz.
                </Typography.Paragraph>
            </Modal>
        </div>
    );
};

export default Employment;
