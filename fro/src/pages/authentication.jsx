import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright '}
      <Link color="inherit" href="https://mui.com/">
        Zoomify
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#2ecc71',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default function Authentication() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [formState, setFormState] = useState(0); // 0 = Sign In, 1 = Sign Up
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleRegister, handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    try {
      const response = formState === 0
        ? await handleLogin(username, password)
        : await handleRegister(name, username, password);

      // console.log('Response:', response); // Log the response
      if (formState === 0) { // Only set message for login
        setMessage('User logged in');
      }
      setOpen(true);
      setError(null);

      // Reset fields and form
      setUsername('');
      setPassword('');
      setName('');

      // Navigate to home after successful authentication
      localStorage.setItem('token', response.token); // Ensure token is set
      console.log('Navigating to /home'); // Log before navigation
      navigate('/home');
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Something went wrong. Try again!';
      setError(errorMessage); // Set error message to display
      console.log('Error:', errorMessage); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/lB.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square
          sx={{
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
          }}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon fontSize="large" />
            </Avatar>

            <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
              <Button 
                variant={formState === 0 ? "contained" : "text"} 
                onClick={() => setFormState(0)}>
                Sign In
              </Button>
              <Button 
                variant={formState === 1 ? "contained" : "text"} 
                onClick={() => setFormState(1)}>
                Sign Up
              </Button>
            </Box>
            
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  InputLabelProps={{ style: { fontSize: 18 } }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                InputLabelProps={{ style: { fontSize: 18 } }}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                InputLabelProps={{ style: { fontSize: 18 } }}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Typography color="error" variant="body2" sx={{ mt: 1 }}>{error}</Typography>}
              <Button
                type="button"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  padding: '10px 0',
                  fontSize: '16px',
                  backgroundImage: 'linear-gradient(90deg, #3498db, #2ecc71)',
                  color: '#fff',
                }}
                onClick={handleAuth}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : formState === 0 ? "Sign In" : "Sign Up"}
              </Button>
              
              <Copyright sx={{ mt: 5 }} />
              <p>It can take upto 90 seconds to confrim your details</p>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
        message={message}
      />
    </ThemeProvider>
  );
}
