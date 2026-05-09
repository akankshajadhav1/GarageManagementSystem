import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { getVehicles, deleteVehicle, createVehicle, updateVehicle } from '../store/slices/vehicleSlice';
import { getCustomers } from '../store/slices/customerSlice';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, TextField, IconButton,
  Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Snackbar, Alert, Chip, MenuItem, alpha,
} from '@mui/material';
import { Add, Edit, Delete, Search, DirectionsCar } from '@mui/icons-material';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const makes = ['Toyota','Honda','Ford','Chevrolet','BMW','Mercedes','Audi','Hyundai','Kia','Nissan','Volkswagen','Subaru','Mazda','Lexus','Jeep','Ram','GMC','Tesla','Volvo','Porsche','Other'];
const fuelTypes = ['Gasoline','Diesel','Electric','Hybrid','Other'];
const transmissions = ['Automatic','Manual','CVT'];

const Vehicles: React.FC = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [formData, setFormData] = useState({
    licensePlate: '', make: 'Toyota', model: '', year: new Date().getFullYear(),
    color: '', vin: '', mileage: '', fuelType: 'Gasoline', transmission: 'Automatic', customer: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, totalPages, isLoading, totalVehicles } = useSelector(
    (state: RootState) => state.vehicles
  );
  const { customers: customersList } = useSelector(
    (state: RootState) => state.customers
  );

  useEffect(() => { 
    dispatch(getVehicles({ page: page + 1, search })); 
    dispatch(getCustomers({ page: 1, search: '' }));
  }, [dispatch, page, search]);
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(0); }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleOpenDialog = (vehicle?: any) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        licensePlate: vehicle.licensePlate, make: vehicle.make, model: vehicle.model,
        year: vehicle.year, color: vehicle.color || '', vin: vehicle.vin || '',
        mileage: vehicle.mileage?.toString() || '', fuelType: vehicle.fuelType, transmission: vehicle.transmission,
        customer: vehicle.customer?._id || vehicle.customer || '',
      });
    } else {
      setEditingVehicle(null);
      setFormData({ licensePlate: '', make: 'Toyota', model: '', year: new Date().getFullYear(),
        color: '', vin: '', mileage: '', fuelType: 'Gasoline', transmission: 'Automatic', customer: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => { setOpenDialog(false); setEditingVehicle(null); };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'year' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.licensePlate.trim()) {
      setSnackbar({ open: true, message: 'License plate is required', severity: 'error' });
      return;
    }
    if (!formData.make) {
      setSnackbar({ open: true, message: 'Vehicle make is required', severity: 'error' });
      return;
    }
    if (!formData.model.trim()) {
      setSnackbar({ open: true, message: 'Vehicle model is required', severity: 'error' });
      return;
    }
    if (!formData.customer) {
      setSnackbar({ open: true, message: 'Customer selection is required', severity: 'error' });
      return;
    }

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        mileage: formData.mileage ? Number(formData.mileage) : 0,
      };

      if (editingVehicle) {
        await dispatch(updateVehicle({ id: editingVehicle._id, data: submitData })).unwrap();
        setSnackbar({ open: true, message: 'Vehicle updated', severity: 'success' });
      } else {
        await dispatch(createVehicle(submitData)).unwrap();
        setSnackbar({ open: true, message: 'Vehicle created', severity: 'success' });
      }
      handleCloseDialog();
      dispatch(getVehicles({ page: page + 1, search }));
    } catch (err: any) {
      setSnackbar({ open: true, message: err || 'An error occurred', severity: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        await dispatch(deleteVehicle(id)).unwrap();
        setSnackbar({ open: true, message: 'Vehicle deleted', severity: 'success' });
      } catch (err: any) {
        setSnackbar({ open: true, message: err || 'Delete failed', severity: 'error' });
      }
    }
  };

  if (isLoading && vehicles.length === 0) return <LoadingSpinner />;

  return (
    <Box sx={{ animation: 'fadeIn 0.4s ease-out', mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>Vehicles</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{totalVehicles || vehicles.length} registered vehicles</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()} sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}>Add Vehicle</Button>
      </Box>

      <Paper sx={{ borderRadius: 3 }}>
        <Box p={2}>
          <TextField fullWidth placeholder="Search by plate, make, or model..." variant="outlined"
            value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ color: '#64748B', mr: 1 }} /> } }} size="small" />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Vehicle</TableCell>
                <TableCell>Plate</TableCell>
                <TableCell>Owner</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Mileage</TableCell>
                <TableCell>Fuel</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: '#64748B' }}>No vehicles found</TableCell></TableRow>
              ) : (
                vehicles.map((vehicle) => (
                  <TableRow key={vehicle._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ p: 1, borderRadius: 1.5, backgroundColor: alpha('#2E7D32', 0.1) }}>
                          <DirectionsCar sx={{ color: '#2E7D32', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            {vehicle.make} {vehicle.model}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B' }}>{vehicle.color}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={vehicle.licensePlate} size="small"
                        sx={{ backgroundColor: alpha('#FFB020', 0.12), color: '#FFB020', fontWeight: 700, fontFamily: 'monospace' }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {vehicle.customer?.firstName ? `${vehicle.customer.firstName} ${vehicle.customer.lastName}` : '—'}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#6C63FF', fontWeight: 600 }}>
                        {vehicle.customer?._id || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{vehicle.year}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{vehicle.mileage?.toLocaleString()} mi</TableCell>
                    <TableCell>
                      <Chip label={vehicle.fuelType} size="small" variant="outlined"
                        sx={{ borderColor: alpha('#2E7D32', 0.4), color: '#2E7D32', fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(vehicle)} sx={{ color: '#2E7D32', mr: 0.5 }}><Edit fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDelete(vehicle._id)} sx={{ color: '#D32F2F' }}><Delete fontSize="small" /></IconButton>
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
        <DialogTitle sx={{ fontWeight: 700 }}>{editingVehicle ? 'Edit Vehicle' : 'New Vehicle'}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth label="License Plate" name="licensePlate" value={formData.licensePlate} onChange={handleFormChange} required />
              <TextField fullWidth select label="Make" name="make" value={formData.make} onChange={handleFormChange}>
                {makes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth label="Model" name="model" value={formData.model} onChange={handleFormChange} required />
              <TextField fullWidth label="Year" name="year" type="number" value={formData.year} onChange={handleFormChange} />
              <TextField fullWidth label="Color" name="color" value={formData.color} onChange={handleFormChange} />
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth label="Mileage" name="mileage" type="number" value={formData.mileage} onChange={handleFormChange} />
              <TextField fullWidth select label="Fuel" name="fuelType" value={formData.fuelType} onChange={handleFormChange}>
                {fuelTypes.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
              </TextField>
              <TextField fullWidth select label="Transmission" name="transmission" value={formData.transmission} onChange={handleFormChange}>
                {transmissions.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <TextField fullWidth label="VIN" name="vin" value={formData.vin} onChange={handleFormChange} />
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
          </div>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{editingVehicle ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Vehicles;
