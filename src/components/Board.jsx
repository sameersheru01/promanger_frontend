import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import styles from '../components/Board.module.css'
import { addtokentoheader, formatDate } from '../helper/Helper';
import outsidecliker from '../helper/outsidecliker';
import TaskBar from './TaskBar';
import { GoPeople } from "react-icons/go";
import { FaChevronDown } from 'react-icons/fa';
import Popup from './popup';

function Board() {
  const [username, setUserName] = useState(null); 
  const [todoData, setTodoData] = useState([]);
  const [isOpen, setisOpen] = useState(false);
  const [addboardpopup, setAddboardpopup] = useState(false);
  const [filterType, setFilterType] = useState('This Week');
  const dropdownRef = useRef(null);
  
  const optionsArray=['Today','This Week','This Month']
  const fetchUserData = async () => {
    try {
      const headers = addtokentoheader({ headers: {} });
      const response = await axios.get('http://localhost:5000/api/alldata', { headers });
      
      setUserName(response.data.user.name);
      setTodoData(response.data.todos);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  useEffect(() => {

    fetchUserData();
  }, []);
    outsidecliker(dropdownRef, () => setisOpen(false));

    const handleStatusUpdate = () => {
      fetchUserData(); 
  };
  return (
    <div className={styles.container}>
      {username ? (<>
        <div className={styles.header}>
        <div className={styles.greet}>
          <p>Welcome! {username}</p>
          <p className={styles.date}>{formatDate()}</p>
          </div>
        <div className={styles.board}>
          <p>Board  <span onClick={()=>setAddboardpopup(true)}><GoPeople size={13} />Add People</span></p>
          <div className={styles.customDropdown} onClick={()=>setisOpen(!isOpen)} ref={dropdownRef}><div className={styles.selected} >
        {filterType} <FaChevronDown className={styles.icon}/>
      </div>
      {isOpen && (
        <div className={styles.optionsList}>
          {optionsArray.map((option, index) => (
            <div
              key={index}
              className={styles.option}
              onClick={() => setFilterType(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}</div>
        </div>
        </div>
          <div className={styles.taskbars}>
          {todoData.map((todo,index)=>(<TaskBar key={index} todo={todo} className={styles.bars} onupdatestatus={handleStatusUpdate} filterType={filterType} />))}
          </div>
          {addboardpopup && <Popup onClose={()=>setAddboardpopup(false)} />}
      </>
      ) : (
        <h3>Loading...</h3> 
      )}
    </div>
  );
}

export default Board;
