import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getCustomers, deleteCustomer, createCustomer, updateCustomer } from '../store/slices/customerSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TextField, IconButton,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Snackbar, Alert, Chip, alpha,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const Customers: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', notes: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  });

  const dispatch = useDispatch<AppDispatch>();
  const { customers, totalPages, isLoading, totalCustomers } = useSelector(
    (state: RootState) => state.customers
  );

  useEffect(() => {
    dispatch(getCustomers({ page: page + 1, search }));
  }, [dispatch, page, search]);

  useEffect(() => {
    const timeout = setTimeout(() => { setSearch(searchInput); setPage(0); }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const handleOpenDialog = (customer?: any) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        firstName: customer.firstName, lastName: customer.lastName,
        email: customer.email || '', phone: customer.phone, notes: customer.notes || '',
        address: customer.address || { street: '', city: '', state: '', zipCode: '' },
      });
    } else {
      setEditingCustomer(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '',
        address: { street: '', city: '', state: '', zipCode: '' } });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingCustomer(null); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingCustomer) {
        await dispatch(updateCustomer({ id: editingCustomer._id, data: formData })).unwrap();
        setSnackbar({ open: true, message: 'Customer updated successfully', severity: 'success' });
      } else {
        await dispatch(createCustomer(formData)).unwrap();
        setSnackbar({ open: true, message: 'Customer created successfully', severity: 'success' });
      }
      handleCloseDialog();
      dispatch(getCustomers({ page: page + 1, search }));
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'An error occurred', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await dispatch(deleteCustomer(id)).unwrap();
        setSnackbar({ open: true, message: 'Customer deleted', severity: 'success' });
      } catch (err: any) {
        setSnackbar({ open: true, message: err || 'Delete failed', severity: 'error' });
      }
    }
  };

  if (isLoading && customers.length === 0) return <LoadingSpinner />;

  return (
    <Box  sx={{ animation: 'fadeIn 0.4s ease-out', mt: 3 }}>
      <Box display="flex" mt-4 justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>Customers</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{totalCustomers || customers.length} total customers</Typography>
        </Box>
        <Button className=' pt-4 mb-3 mt-4 p-3' variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>
          Add Customer
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <Box p={2}>
          <TextField  className=' m-3 mt-4 ' fullWidth placeholder="Search customers by name, email, or phone..."
            variant="outlined" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ color: '#64748B', mr: 1 }} /> } }}
            size="small"
          />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Customer ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Vehicles</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: '#64748B' }}>
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#6C63FF', fontWeight: 600 }}>
                        {customer._id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {customer.firstName} {customer.lastName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{customer.email || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{customer.phone}</TableCell>
                    <TableCell>
                      <Chip label={`${customer.vehicles?.length || 0} vehicles`} size="small"
                        sx={{ backgroundColor: alpha('#2E7D32', 0.1), color: '#2E7D32', fontWeight: 700, borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#64748B', fontSize: '0.85rem' }}>
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(customer)} sx={{ color: '#2E7D32', mr: 0.5 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(customer._id)} sx={{ color: '#D32F2F' }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination rowsPerPageOptions={[10]} component="div"
          count={totalPages * 10} rowsPerPage={10} page={page}
          onPageChange={(_, p) => setPage(p)}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingCustomer ? 'Edit Customer' : 'New Customer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleFormChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleFormChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Street" name="address.street" value={formData.address.street} onChange={handleFormChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="City" name="address.city" value={formData.address.city} onChange={handleFormChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="State" name="address.state" value={formData.address.state} onChange={handleFormChange} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth label="ZIP Code" name="address.zipCode" value={formData.address.zipCode} onChange={handleFormChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Notes" name="notes" multiline rows={2} value={formData.notes} onChange={handleFormChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCustomer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Customers;
