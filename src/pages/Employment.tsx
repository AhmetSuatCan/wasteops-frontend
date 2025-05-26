import React, { useEffect, useState } from 'react';
import { useEmployment } from '../hooks/useEmployment';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Container,
    IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
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
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleTerminateClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirmTermination = async () => {
        if (selectedEmployee) {
            await terminateEmployment(selectedEmployee.user.id);
            setIsConfirmDialogOpen(false);
            setSelectedEmployee(null);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1">
                    Çalışan Yönetimi
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                </Box>
            ) : employees.length === 0 ? (
                <Card
                    sx={{
                        py: 4,
                        px: 3,
                        textAlign: 'center',
                        border: '3px solid #169976',
                        bgcolor: '#ffffff',
                        borderRadius: 3,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#666',
                            fontWeight: 500
                        }}
                    >
                        Hiç Çalışan Yok
                    </Typography>
                </Card>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {employees.map((employee) => (
                        <Card
                            key={employee.id}
                            sx={{
                                py: 2.5,
                                px: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '3px solid #169976',
                                bgcolor: '#ffffff',
                                borderRadius: 3,
                                '&:hover': {
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out',
                                    bgcolor: '#fafafa'
                                }
                            }}
                        >
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    sx={{
                                        mb: 1,
                                        color: '#169976',
                                        fontWeight: 700,
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {employee.user.name}
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#666'
                                        }}
                                    >
                                        Email: {employee.user.email}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#666'
                                        }}
                                    >
                                        Telefon: {employee.user.phone_number}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{
                                            fontWeight: 500,
                                            color: '#666'
                                        }}
                                    >
                                        Başlangıç: {format(new Date(employee.start_date), 'dd MMMM yyyy', { locale: tr })}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Box>
                                <Button
                                    onClick={() => handleTerminateClick(employee)}
                                    variant="outlined"
                                    color="error"
                                    startIcon={<LogoutIcon />}
                                    size="large"
                                    sx={{
                                        borderColor: '#d32f2f',
                                        color: '#d32f2f',
                                        px: 3,
                                        py: 1.5,
                                        fontSize: '1rem',
                                        '&:hover': {
                                            borderColor: '#b71c1c',
                                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                                        }
                                    }}
                                >
                                    Çıkış
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            )}

            <Dialog
                open={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
            >
                <DialogTitle>Çalışanı Çıkar</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedEmployee ? selectedEmployee.user.name : ''} isimli çalışanı çıkarmak istediğinizden emin misiniz?
                        Bu işlem geri alınamaz.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsConfirmDialogOpen(false)}>İptal</Button>
                    <Button
                        onClick={handleConfirmTermination}
                        color="primary"
                        variant="contained"
                        sx={{
                            bgcolor: '#169976',
                            '&:hover': {
                                bgcolor: '#138066'
                            }
                        }}
                    >
                        Çalışanı Çıkar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Employment;
