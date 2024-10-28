import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (Component) => {
  const AuthComponent = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
      }
    }, [navigate]);

    return <Component {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
