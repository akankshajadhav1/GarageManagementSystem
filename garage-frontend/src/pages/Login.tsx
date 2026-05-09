import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate('/');
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(108, 99, 255, 0.15) 0%, #0A0E1A 70%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <BuildCircleIcon sx={{ fontSize: 48, color: '#6C63FF', mb: 1 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6C63FF, #00D9FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              GarageHub
            </Typography>
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Sign in to manage your garage
            </Typography>
          </Box>

          {isError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 76, 106, 0.1)',
                color: '#FF4C6A',
                border: '1px solid rgba(255, 76, 106, 0.2)',
                '& .MuiAlert-icon': { color: '#FF4C6A' },
              }}
            >
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                mb: 3,
                pb: 1.5,
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '8px 12px',
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
                '& .MuiInputBase-input': {
                  padding: '14px 8px',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(148, 163, 184, 0.5)',
                  opacity: 1,
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  mb: 1.5,
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                    fontWeight: 600,
                  },
                  '&.MuiFormLabel-filled': {
                    color: '#FFFFFF',
                    fontWeight: 600,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#6C63FF', mr: 1 }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              variant="outlined"
              sx={{
                mb: 3,
                pb: 1.5,
                '& .MuiOutlinedInput-root': {
                  color: '#F1F5F9',
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  padding: '8px 12px',
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
                '& .MuiInputBase-input': {
                  padding: '14px 8px',
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(148, 163, 184, 0.5)',
                  opacity: 1,
                },
                '& .MuiInputLabel-root': {
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  mb: 1.5,
                  '&.Mui-focused': {
                    color: '#FFFFFF',
                    fontWeight: 600,
                  },
                  '&.MuiFormLabel-filled': {
                    color: '#FFFFFF',
                    fontWeight: 600,
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#6C63FF', mr: 1 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ color: '#6C63FF' }} />
                        ) : (
                          <VisibilityIcon sx={{ color: '#6C63FF' }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6C63FF 0%, #4A42DB 100%)',
                textTransform: 'none',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #8B85FF 0%, #6C63FF 100%)',
                  boxShadow: '0 8px 30px rgba(108, 99, 255, 0.4)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #6C63FF 0%, #4A42DB 100%)',
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>
                  Create one
                </Link>
              </Typography>
            </Box>
          </form>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(148, 163, 184, 0.1)', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" sx={{ color: '#6C63FF', fontFamily: 'monospace', fontWeight: 600 }}>
              admin@garage.com / admin123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
