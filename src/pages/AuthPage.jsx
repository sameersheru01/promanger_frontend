import React, { useEffect } from 'react';
import styles from '../pages/AuthPage.module.css';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
    
  return (
    <div className={styles.container}>
      <div className={styles.imgcontainer}>
        
      </div>
      <div className={styles.form}>
        <AuthForm />
        
      </div>
    </div>
  );
}

export default AuthPage;
