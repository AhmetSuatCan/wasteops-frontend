import React, { useEffect, useRef } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Space, Typography, Row, Col, Tag } from 'antd';
import { useTeams } from '../hooks/useTeams';
import { PlusOutlined, DeleteOutlined, UserAddOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';

const { Title } = Typography;

const TeamCard: React.FC<{
    team: any;
    onSelect: (team: any) => void;
    onDisband: (id: string) => void;
}> = ({ team, onSelect, onDisband }) => {
    const buttonStyle = {
        height: '40px',
        padding: '0 24px',
        fontSize: '16px',
        fontWeight: '600'
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'onShift':
                return {
                    color: '#169976',
                    text: 'Görevde'
                };
            case 'inactive':
                return {
                    color: '#ff4d4f',
                    text: 'Pasif'
                };
            default:
                return {
                    color: '#ff4d4f',
                    text: status
                };
        }
    };

    const statusConfig = getStatusConfig(team.status);

    return (
        <Card
            title={
                <Row align="middle" gutter={24}>
                    <Col>
                        <Tag
                            color={statusConfig.color}
                            style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                padding: '8px 24px',
                                borderRadius: '4px',
                                border: 'none',
                                minWidth: '120px',
                                textAlign: 'center'
                            }}
                        >
                            {statusConfig.text}
                        </Tag>
                    </Col>
                    <Col>
                        <Title level={4} style={{ margin: 0 }}>
                            {team.name}
                        </Title>
                    </Col>
                </Row>
            }
            extra={
                <Space>
                    <Button
                        type="primary"
                        onClick={() => onSelect(team)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: '#169976',
                            borderColor: '#169976',
                        }}
                    >
                        Detayları Göster
                    </Button>
                    <Button
                        danger
                        onClick={() => onDisband(team.id)}
                        style={buttonStyle}
                    >
                        Takımı Dağıt
                    </Button>
                </Space>
            }
            style={{
                width: '100%',
                marginBottom: '16px',
                padding: '16px 0'
            }}
            bodyStyle={{ display: 'none' }}
            headStyle={{
                padding: '16px 24px',
                borderBottom: 'none'
            }}
        />
    );
};

const Teams: React.FC = () => {
    const {
        teams,
        selectedTeam,
        teamMembers,
        unteamedEmployees,
        loading,
        modals,
        fetchTeams,
        selectTeam,
        createTeam,
        updateTeam,
        disbandTeam,
        addMemberToTeam,
        removeMemberFromTeam,
        openAddMemberModal,
        closeAddMemberModal,
        openDisbandConfirmModal,
        closeDisbandConfirmModal,
        openCreateTeamModal,
        closeCreateTeamModal,
    } = useTeams();

    const [createForm] = Form.useForm();
    const [addMemberForm] = Form.useForm();
    const [memberToRemove, setMemberToRemove] = React.useState<any>(null);
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchTeams();
    }, [fetchTeams]);

    const handleCreateTeam = async (values: any) => {
        console.log('Create team form values:', values);
        await createTeam(values.name, values.status);
        createForm.resetFields();
        closeCreateTeamModal();
    };

    const handleAddMember = async (values: any) => {
        console.log('Form values:', values);
        if (selectedTeam) {
            console.log('Selected team:', selectedTeam);
            await addMemberToTeam(values.employeeId, selectedTeam.id, values.role);
            addMemberForm.resetFields();
            closeAddMemberModal();
        }
    };

    const handleTeamSelect = async (team: any) => {
        await selectTeam(team);
        // Scroll to details section with smooth behavior and offset
        detailsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleRemoveMember = (member: any) => {
        setMemberToRemove(member);
    };

    const confirmRemoveMember = async () => {
        if (memberToRemove) {
            await removeMemberFromTeam(memberToRemove.id);
            setMemberToRemove(null);
        }
    };

    const memberColumns = [
        {
            title: 'İsim',
            dataIndex: ['user', 'name'],
            key: 'name',
        },
        {
            title: 'E-posta',
            dataIndex: ['user', 'email'],
            key: 'email',
        },
        {
            title: 'Telefon',
            dataIndex: ['user', 'phone_number'],
            key: 'phone',
        },
        {
            title: 'Rol',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => {
                const roleMap: { [key: string]: string } = {
                    'Driver': 'Sürücü',
                    'Collector': 'Toplayıcı',
                    'TeamLeader': 'Takım Lideri'
                };
                return roleMap[role] || role;
            }
        },
        {
            title: 'Atanma Tarihi',
            dataIndex: 'assigned_at',
            key: 'assigned_at',
            render: (date: string) => new Date(date).toLocaleDateString('tr-TR'),
        },
        {
            title: 'İşlemler',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveMember(record)}
                >
                    Çıkar
                </Button>
            ),
        },
    ];

    const buttonStyle = {
        height: '40px',
        padding: '0 24px',
        fontSize: '16px',
        fontWeight: '600'
    };

    const primaryButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#169976',
        borderColor: '#169976',
    };

    return (
        <div style={{ padding: '24px', width: '100%' }}>
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
                    Ekipler
                </h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openCreateTeamModal}
                    style={{
                        ...buttonStyle,
                        backgroundColor: '#169976',
                        borderColor: '#169976',
                    }}
                >
                    Takım Oluştur
                </Button>
            </div>

            {/* Team Details Section */}
            {selectedTeam && (
                <div
                    ref={detailsRef}
                    style={{
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: 'fadeInUp 0.5s ease forwards',
                        marginBottom: '24px'
                    }}
                >
                    <Card
                        title={
                            <Title level={3} style={{ margin: 0 }}>
                                {selectedTeam.name}
                            </Title>
                        }
                        style={{
                            marginBottom: '24px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        extra={
                            <Button
                                type="primary"
                                icon={<UserAddOutlined />}
                                onClick={openAddMemberModal}
                                style={{
                                    backgroundColor: '#169976',
                                    borderColor: '#169976',
                                    height: '40px',
                                    padding: '0 24px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Üye Ekle
                            </Button>
                        }
                    >
                        <Table
                            columns={memberColumns}
                            dataSource={teamMembers}
                            loading={loading}
                            rowKey="id"
                            style={{
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </Card>
                </div>
            )}

            {/* Team List Section */}
            <Row gutter={[16, 16]}>
                {teams.map((team) => (
                    <Col xs={24} key={team.id}>
                        <TeamCard
                            team={team}
                            onSelect={selectTeam}
                            onDisband={() => {
                                openDisbandConfirmModal();
                                selectTeam(team);
                            }}
                        />
                    </Col>
                ))}
            </Row>

            {/* Create Team Modal */}
            <Form form={createForm} onFinish={handleCreateTeam}>
                <Modal
                    title="Takım Oluştur"
                    open={modals.createTeam}
                    onCancel={closeCreateTeamModal}
                    footer={null}
                    confirmLoading={loading}
                >
                    <Form.Item
                        name="name"
                        label="Takım Adı"
                        rules={[{ required: true, message: 'Lütfen takım adını girin' }]}
                    >
                        <Input placeholder="Takım adını girin" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Durum"
                        rules={[{ required: true, message: 'Lütfen takım durumunu seçin' }]}
                    >
                        <Select placeholder="Takım durumunu seçin">
                            <Select.Option value="onShift">Görevde</Select.Option>
                            <Select.Option value="inactive">Pasif</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => createForm.submit()}
                                loading={loading}
                                style={primaryButtonStyle}
                            >
                                Oluştur
                            </Button>
                            <Button
                                onClick={closeCreateTeamModal}
                                style={buttonStyle}
                            >
                                İptal
                            </Button>
                        </Space>
                    </Form.Item>
                </Modal>
            </Form>

            {/* Add Member Modal */}
            <Form form={addMemberForm} onFinish={handleAddMember}>
                <Modal
                    title="Takım Üyesi Ekle"
                    open={modals.addMember}
                    onCancel={closeAddMemberModal}
                    footer={null}
                    confirmLoading={loading}
                >
                    <Form.Item
                        name="employeeId"
                        label="Çalışan"
                        rules={[{ required: true, message: 'Lütfen bir çalışan seçin' }]}
                    >
                        <Select
                            loading={loading}
                            placeholder="Çalışan seçin"
                        >
                            {unteamedEmployees.map((employee) => (
                                <Select.Option key={employee.id} value={employee.id}>
                                    {employee.user.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Rol"
                        rules={[{ required: true, message: 'Lütfen bir rol seçin' }]}
                    >
                        <Select placeholder="Rol seçin">
                            <Select.Option value="Driver">Sürücü</Select.Option>
                            <Select.Option value="Collector">Toplayıcı</Select.Option>
                            <Select.Option value="TeamLeader">Takım Lideri</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => addMemberForm.submit()}
                                loading={loading}
                                style={primaryButtonStyle}
                            >
                                Ekle
                            </Button>
                            <Button
                                onClick={closeAddMemberModal}
                                style={buttonStyle}
                            >
                                İptal
                            </Button>
                        </Space>
                    </Form.Item>
                </Modal>
            </Form>

            {/* Disband Confirmation Modal */}
            <Modal
                title="Takımı Dağıt"
                open={modals.disbandConfirm}
                onOk={() => {
                    if (selectedTeam) {
                        disbandTeam(selectedTeam.id);
                        closeDisbandConfirmModal();
                    }
                }}
                onCancel={closeDisbandConfirmModal}
                okButtonProps={{
                    danger: true,
                    style: buttonStyle
                }}
                cancelButtonProps={{
                    style: buttonStyle
                }}
            >
                <p>Bu takımı dağıtmak istediğinizden emin misiniz?</p>
            </Modal>

            {/* Remove Member Confirmation Modal */}
            <Modal
                title="Takım Üyesini Çıkar"
                open={!!memberToRemove}
                onOk={confirmRemoveMember}
                onCancel={() => setMemberToRemove(null)}
                confirmLoading={loading}
                okButtonProps={{
                    danger: true,
                    style: buttonStyle
                }}
                cancelButtonProps={{
                    style: buttonStyle
                }}
            >
                <p>{memberToRemove?.user?.name} isimli üyeyi takımdan çıkarmak istediğinizden emin misiniz?</p>
            </Modal>
        </div>
    );
};

// Add this at the top of the file, after the imports
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .ant-table {
        transition: all 0.3s ease;
    }

    .ant-table-row {
        transition: all 0.3s ease;
    }

    .ant-table-row:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .ant-card {
        transition: all 0.3s ease;
    }

    .ant-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

export default Teams;
