import React, { useState, useContext, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  TextField, 
  Button, 
  Box, 
  Snackbar, 
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import withAuth from '../contexts/withAuth';
import { AuthContext } from '../contexts/AuthContext';
import '../App.css';

const Home = () => {
  const [meetingCode, setMeetingCode] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [expanded, setExpanded] = useState(false);
  const [meetingHistory, setMeetingHistory] = useState([]);
  const navigate = useNavigate();
  const { addToUserHistory,getHisttoryofUser } = useContext(AuthContext);

  // Fetch meeting history 
  useEffect(() => {
    const fetchMeetingHistory = async () => {
      try {
        const history = await getHisttoryofUser();
        console.log('Meeting history:', history);
        setMeetingHistory(history);
      } catch (error) {
        console.error('Failed to fetch meeting history:', error);
      }
    };

    fetchMeetingHistory();
  }, [getHisttoryofUser]);

  const handleJoinVideoCall = async () => {
    if (meetingCode.trim()) {
      try {
        await addToUserHistory(meetingCode);
        
        navigate(`/meeting/${meetingCode}`);
      } catch (e) {
        setNotification({
          open: true,
          message: 'Failed to join meeting. Please try again.',
          severity: 'error'
        });
      }
    } else {
      setNotification({
        open: true,
        message: 'Please enter a valid meeting code.',
        severity: 'warning'
      });
    }
  };

  const generateMeetingCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleCreateMeeting = async () => {
    try {
      const newMeetingCode = generateMeetingCode();
      setMeetingCode(newMeetingCode);
      
      await addToUserHistory(newMeetingCode);
      localStorage.setItem('meetingCode', newMeetingCode);

      await navigator.clipboard.writeText(newMeetingCode);
      
      setNotification({
        open: true,
        message: `Meeting code ${newMeetingCode} copied to clipboard!`,
        severity: 'success'
      });

      navigate(`/meeting/${newMeetingCode}`);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to create meeting. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <div className="landingPageContainer">
      <nav className="navBar">
        <h2 style={{ color: "#14213d" }}>Zoomify</h2>
        <div className="navlist">
          <Button
            size="large"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
            style={{ color: '#14213d' }}
          >
            Logout
          </Button>
        </div>
      </nav>
      
      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2 style={{ color: "#14213d" }}>
              Providing high-quality video conferencing solutions for all your needs.
            </h2>
            <Box display="flex" gap={2} mt={2}>
              <TextField
                id="outlined-basic"
                label="Enter Meeting Code"
                variant="outlined"
                value={meetingCode}
                onChange={(e) => setMeetingCode(e.target.value)}
              />
              <Button onClick={handleJoinVideoCall} variant="contained">
                Join
              </Button>
            </Box>
            <div className='createCode'>
              <p style={{color:"#14213d"}}>Or Create</p>
              <Button variant="contained" color="primary" onClick={handleCreateMeeting}>
                Create Meeting
              </Button>
            </div>
          </div>
        </div>
        
        <div className="rightPanel">
          <img src="/svgs/meeting1.svg" alt="Meeting" className="responsiveImage" />
        </div>
      </div>

      {/* Meeting History Accordion */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'background.paper' }}>
        <Accordion expanded={expanded} onChange={handleAccordionChange}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="meeting-history-content"
            id="meeting-history-header"
          >
            <Typography>Meeting History</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {meetingHistory.length > 0 ? (
              <Box>
                {meetingHistory.map((meeting) => (
                  <Box key={meeting.meetingCode} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    <Typography variant="subtitle1">Meeting Code: {meeting.meetingCode}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {format(new Date(meeting.date), 'PPpp')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No meeting history available</Typography>
            )}
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Enhanced Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default withAuth(Home);