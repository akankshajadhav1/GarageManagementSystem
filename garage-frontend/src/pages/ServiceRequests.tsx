import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getServiceRequests, deleteServiceRequest, createServiceRequest, updateServiceRequest } from '../store/slices/serviceSlice';
import { getVehicles } from '../store/slices/vehicleSlice';
import { getCustomers } from '../store/slices/customerSlice';
import { getUsers } from '../store/slices/userSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TextField, IconButton,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, MenuItem, alpha,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import StatusBadge from '../components/shared/StatusBadge';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const statuses = ['', 'pending', 'diagnosing', 'waiting_parts', 'in_progress', 'completed', 'cancelled'];
const priorities = ['', 'low', 'medium', 'high', 'urgent'];

const ServiceRequests: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSR, setEditingSR] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [vehiclesList, setVehiclesList] = useState<any[]>([]);
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [mechanicsList, setMechanicsList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    vehicle: '', customer: '', description: '', status: 'pending',
    priority: 'medium', estimatedCost: '', actualCost: '', notes: '', assignedMechanic: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { serviceRequests, totalPages, isLoading, totalRequests } = useSelector(
    (state: RootState) => state.services
  );
  const { vehicles } = useSelector((state: RootState) => state.vehicles);
  const { customers } = useSelector((state: RootState) => state.customers);
  const { users } = useSelector((state: RootState) => state.users);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getServiceRequests({ page: page + 1, search, status: statusFilter, priority: priorityFilter }));
  }, [dispatch, page, search, statusFilter, priorityFilter]);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(0); }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (openDialog && vehicles.length === 0) {
      dispatch(getVehicles({ page: 1, search: '' }));
    }
    if (openDialog && customers.length === 0) {
      dispatch(getCustomers({ page: 1, search: '' }));
    }
    if (openDialog && users.length === 0 && user?.role === 'admin') {
      dispatch(getUsers());
    }
  }, [openDialog, dispatch, vehicles.length, customers.length, users.length, user]);

  useEffect(() => {
    if (vehicles.length > 0) {
      setVehiclesList(vehicles);
    }
  }, [vehicles]);

  useEffect(() => {
    if (customers.length > 0) {
      setCustomersList(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (users.length > 0) {
      // Filter only mechanics and active users
      const mechanics = users.filter(user => user.role === 'mechanic' && user.isActive);
      setMechanicsList(mechanics);
    } else if (user?.role !== 'admin') {
      // If user is not admin and no users loaded, set empty list
      setMechanicsList([]);
    }
  }, [users, user]);

  const handleOpenDialog = (sr?: any) => {
    if (sr) {
      setEditingSR(sr);
      setFormData({
        vehicle: sr.vehicle?._id || sr.vehicle || '', customer: sr.customer?._id || sr.customer || '',
        description: sr.description, status: sr.status, priority: sr.priority,
        estimatedCost: sr.estimatedCost?.toString() || '', actualCost: sr.actualCost?.toString() || '', notes: sr.notes || '',
        assignedMechanic: sr.assignedMechanic?._id || sr.assignedMechanic || '',
      });
    } else {
      setEditingSR(null);
      setFormData({ vehicle: '', customer: '', description: '', status: 'pending',
        priority: 'medium', estimatedCost: '', actualCost: '', notes: '', assignedMechanic: '' });
    }
    setOpenDialog(true);

    // Auto-populate customer if vehicle is already selected (for editing)
    if (sr && sr.vehicle && !sr.customer) {
      const selectedVehicle = vehiclesList.find(v => v._id === (sr.vehicle?._id || sr.vehicle));
      if (selectedVehicle && selectedVehicle.customer) {
        setFormData(prev => ({
          ...prev,
          customer: selectedVehicle.customer._id || selectedVehicle.customer
        }));
      }
    }
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingSR(null); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-populate customer when vehicle is selected
    if (name === 'vehicle' && value) {
      const selectedVehicle = vehiclesList.find(v => v._id === value);
      if (selectedVehicle && selectedVehicle.customer) {
        updatedData.customer = selectedVehicle.customer._id || selectedVehicle.customer;
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.vehicle) {
      setSnackbar({ open: true, message: 'Vehicle selection is required', severity: 'error' });
      return;
    }
    if (!formData.customer) {
      setSnackbar({ open: true, message: 'Customer selection is required', severity: 'error' });
      return;
    }
    if (!formData.description.trim()) {
      setSnackbar({ open: true, message: 'Service description is required', severity: 'error' });
      return;
    }

    try {
      // Prepare data for submission
      const submitData: any = {
        ...formData,
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : 0,
        actualCost: formData.actualCost ? Number(formData.actualCost) : 0,
      };
      if (!submitData.assignedMechanic) delete submitData.assignedMechanic;
      if (editingSR) {
        await dispatch(updateServiceRequest({ id: editingSR._id, data: submitData })).unwrap();
        setSnackbar({ open: true, message: 'Service request updated', severity: 'success' });
      } else {
        await dispatch(createServiceRequest(submitData)).unwrap();
        setSnackbar({ open: true, message: 'Service request created', severity: 'success' });
      }
      handleCloseDialog();
      dispatch(getServiceRequests({ page: page + 1, search, status: statusFilter, priority: priorityFilter }));
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'An error occurred', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this service request?')) {
      try {
        await dispatch(deleteServiceRequest(id)).unwrap();
        setSnackbar({ open: true, message: 'Service request deleted', severity: 'success' });
      } catch (err: any) {
        setSnackbar({ open: true, message: err || 'Delete failed', severity: 'error' });
      }
    }
  };

  if (isLoading && serviceRequests.length === 0) return <LoadingSpinner />;

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>Service Requests</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{totalRequests || serviceRequests.length} total requests</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>New Request</Button>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <Box p={2} display="flex" gap={2} flexWrap="wrap">
          <TextField sx={{ flex: 1, minWidth: 200 }} placeholder="Search..." variant="outlined" value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ color: '#64748B', mr: 1 }} /> } }} size="small" />
          <TextField select label="Status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 140 }} size="small">
            {statuses.map(s => <MenuItem key={s} value={s}>{s ? s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'All Statuses'}</MenuItem>)}
          </TextField>
          <TextField select label="Priority" value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 130 }} size="small">
            {priorities.map(p => <MenuItem key={p} value={p}>{p ? p.charAt(0).toUpperCase() + p.slice(1) : 'All Priorities'}</MenuItem>)}
          </TextField>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request #</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {serviceRequests.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>No service requests found</TableCell></TableRow>
              ) : (
                serviceRequests.map((sr) => (
                  <TableRow key={sr._id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#6C63FF', fontFamily: 'monospace' }}>
                        {sr.requestNumber}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {sr.vehicle?.make ? `${sr.vehicle.make} ${sr.vehicle.model}` : '—'}
                      <Typography variant="caption" display="block" sx={{ color: '#64748B' }}>
                        {sr.vehicle?.licensePlate || ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {sr.customer?.firstName ? `${sr.customer.firstName} ${sr.customer.lastName}` : '—'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sr.description}
                    </TableCell>
                    <TableCell><StatusBadge status={sr.status} /></TableCell>
                    <TableCell><StatusBadge status={sr.priority} /></TableCell>
                    <TableCell sx={{ color: '#14B8A6', fontWeight: 600 }}>
                      ${(sr.actualCost || sr.estimatedCost || 0).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(sr)} sx={{ color: '#6C63FF' }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(sr._id)} sx={{ color: '#FF4C6A' }}><Delete fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10]} component="div"
          count={totalPages * 10} rowsPerPage={10} page={page} onPageChange={(_, p) => setPage(p)} />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingSR ? 'Edit Service Request' : 'New Service Request'}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth select label="Vehicle" name="vehicle" value={formData.vehicle} onChange={handleFormChange} required variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }}>
                <MenuItem value="">Select a vehicle</MenuItem>
                {vehiclesList.map((v) => (
                  <MenuItem key={v._id} value={v._id}>
                    {v.make} {v.model} ({v.licensePlate})
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth select label="Customer" name="customer" value={formData.customer} onChange={handleFormChange} required variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }}>
                <MenuItem value="">Select a customer</MenuItem>
                {customersList.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.firstName} {c.lastName} ({c.email})
                  </MenuItem>
                ))}
              </TextField>
            </div>
            {formData.vehicle && formData.customer && (
              <Typography variant="caption" sx={{ color: '#6C63FF', fontSize: '0.7rem', mt: 0.5, display: 'block' }}>
                ✓ Customer auto-selected based on vehicle owner
              </Typography>
            )}
            <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleFormChange} required multiline rows={2} variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F1F5F9',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6C63FF',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
                '&.MuiFormLabel-filled': {
                  color: '#FFFFFF',
                },
              },
            }} />
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleFormChange} variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }}>
                {statuses.filter(s => s).map(s => <MenuItem key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</MenuItem>)}
              </TextField>
              <TextField fullWidth select label="Priority" name="priority" value={formData.priority} onChange={handleFormChange} variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }}>
                {priorities.filter(p => p).map(p => <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>)}
              </TextField>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth label="Est. Cost ($)" name="estimatedCost" type="number" value={formData.estimatedCost} onChange={handleFormChange} variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }} />
              <TextField fullWidth label="Actual Cost ($)" name="actualCost" type="number" value={formData.actualCost} onChange={handleFormChange} variant="outlined" sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  '& fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(148, 163, 184, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                  },
                },
              }} />
              {user?.role === 'admin' ? (
                <TextField fullWidth select label="Assigned Mechanic" name="assignedMechanic" value={formData.assignedMechanic} onChange={handleFormChange} variant="outlined" sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#F1F5F9',
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6C63FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFFFFF',
                    '&.Mui-focused': {
                      color: '#FFFFFF',
                    },
                  },
                }}>
                  <MenuItem value="">Select a mechanic</MenuItem>
                  {mechanicsList.map((mechanic) => (
                    <MenuItem key={mechanic._id} value={mechanic._id}>
                      {mechanic.username} ({mechanic.email})
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField fullWidth label="Assigned Mechanic (Optional)" name="assignedMechanic" value={formData.assignedMechanic} onChange={handleFormChange} variant="outlined" sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#F1F5F9',
                    backgroundColor: 'rgba(30, 41, 59, 0.5)',
                    '& fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(148, 163, 184, 0.4)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6C63FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#FFFFFF',
                    '&.Mui-focused': {
                      color: '#FFFFFF',
                    },
                  },
                }} placeholder="Enter mechanic name or leave empty" helperText="Only admins can assign specific mechanics from the system" />
              )}
            </div>
            <TextField fullWidth label="Notes" name="notes" multiline rows={2} value={formData.notes} onChange={handleFormChange} variant="outlined" sx={{
              '& .MuiOutlinedInput-root': {
                color: '#F1F5F9',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                '& fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(148, 163, 184, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6C63FF',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#FFFFFF',
                '&.Mui-focused': {
                  color: '#FFFFFF',
                },
                '&.MuiFormLabel-filled': {
                  color: '#FFFFFF',
                },
              },
            }} />
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingSR ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceRequests;
