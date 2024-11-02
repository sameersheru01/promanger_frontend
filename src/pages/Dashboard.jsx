import styles from '../pages/Dashboard.module.css';
import React from 'react'
import Sidenav from '../components/Sidenav';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div className={styles.container}>
      <div className={styles.left}><Sidenav/></div>
      <div className={styles.right}>
        <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard