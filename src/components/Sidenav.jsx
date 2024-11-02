import React, { useState } from 'react';
import styles from '../components/Sidenav.module.css';
import { PiLayoutThin } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";
import { GoDatabase } from "react-icons/go";
import { FiSettings } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import Popup from './popup';

function Sidenav() {
  const [active, setActive] = useState('');
  const [ispopupopen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate()
  const handlelogout = ()=>{
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>
        <span className={styles.image}></span>
        <p>Pro Manage</p>
      </div>
      <ul className={styles.listitems}>
        <Link to="/dashboard/board" >
        <li
          className={`${active == 'board' ? styles.active : ''}`}
          onClick={() => setActive('board')}
        >
          <PiLayoutThin size={25}/>
          Board
        </li>
        </Link>
        <Link to="/dashboard/analytics">
        <li
          className={`${active == 'Analytics' ? styles.active : ''}`}
          onClick={() => setActive('Analytics')}
        >
          <GoDatabase />
          Analytics
        </li>
          </Link>
          <Link to="/dashboard/settings">
        <li
          className={`${active == 'Settings' ? styles.active : ''}`}
          onClick={() => setActive('Settings')}
        >
          <FiSettings />
          Settings
        </li>
          </Link>
      </ul></div>
      <div className={styles.logout} onClick={()=>setIsPopupOpen(true)}>  
        <IoLogOutOutline/>
        <p>Logout</p>
      </div>
      {ispopupopen && <Popup type={"Logout"} onClose={()=>setIsPopupOpen(false)} logout={handlelogout}/>}
    </div>
  );
}

export default Sidenav;
