import React, { useState, useRef, useEffect } from 'react';
import styles from '../components/TodoCard.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoIosArrowDown } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { GoDotFill } from "react-icons/go";
import { cardDate, getCurrentUserId, GetInitials, isDuePassed, isDueToday } from '../helper/Helper';
import axios from 'axios';
import outsidecliker from '../helper/outsidecliker';
import AddTodo from './AddTodo';

function TodoCard({data, onupdatestatus, isDropdownOpen,toggleDropdown}) {
    
    const [dots,setdots]=useState(false);
    const Buttons = ["BACKLOG","PROGRESS","DONE","TO-DO"]
    const buttons = Buttons.filter(btn => btn !== data.status);
    const dropdownRef = useRef(null);
    const totalCheckboxes = data.checklist.length;
    const checkedCount = data.checklist.reduce((count, item) => item.checked ? count + 1 : count, 0);
    
    const [editpopup,setEditpopup]=useState(false);
    const currentuserid = getCurrentUserId()
    const priorityColors = {
        "HIGH PRIORITY": "#FF2473",
        "MODERATE PRIORITY": "#18B0FF",
        "LOW PRIORITY": "#63C05B"
    };
    const notify = () => {
        navigator.clipboard.writeText(`${window.location.origin}/card/${data._id}`)
        toast.dismiss();
        toast("link copied", {
            position: "top-right", 
            autoClose: 3000,
            closeButton: false,
            progress: false,
            className: styles.toast,
        });
    };
    const handleCheckboxChange = async(index)=>{
        const updatedChecklist = [...data.checklist]; 
        updatedChecklist[index].checked = !updatedChecklist[index].checked; 
        
        try {
            const response = await axios.patch(`http://localhost:5000/api/checklist/${data._id}`, { checklist: updatedChecklist });
            if(response.status==200){
                onupdatestatus()
            }
        } catch (error) {
            console.error('Error updating checklist:', error);   
        }
        
    };

    const handleDelete = async()=>{
        
        try {
           const response = await axios.delete(`http://localhost:5000/api/todo/delete/${data._id}`);
            
            if(response.status==200){
                onupdatestatus();
                setdots(false)
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    const handleStatusChange = async (newStatus) => {
        
        try {
            
           const response = await axios.patch(`http://localhost:5000/api/todostatus/${data._id}`, { status: newStatus });
            
            if(response.status==200){
                onupdatestatus();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };
    outsidecliker(dropdownRef, () => setdots(false));

  return (
    <div className={styles.card}>
        <div className={styles.head}>
            <span><GoDotFill size={15} style={{ color: priorityColors[data.priority.trim().toUpperCase()]  }}/><p>{data.priority}</p>{data.assignedto && data.assignedto !== currentuserid && <span className={styles.intialsicon}>{GetInitials(data.assignedto)}</span>}</span>
            <div className={styles.dots} onClick={()=>{setdots(!dots)}}><BsThreeDots size={20}/></div>
            {dots && 
                <div ref={dropdownRef} className={styles.dotsbar}>
                    <span onClick={()=>setEditpopup(true)}>Edit</span>
                    <span onClick={notify} >Share</span>
                    <span style={{ color: '#CF3636' }} onClick={()=>handleDelete()}>Delete</span>
                </div>
            }
        </div>
        <p className={styles.title}>{data.title}</p>
        <span className={styles.spantitle}>{data.title}</span>
        <div className={styles.checkbar}>
            <p>Checklist ({checkedCount}/{totalCheckboxes})</p><div className={styles.dropdownicon}><IoIosArrowDown size={18} onClick={toggleDropdown} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} /></div>
        </div>
            {isDropdownOpen && <div className={styles.todos}>
                {data.checklist.map((data,index)=>(
                    <div className={styles.inputcontainer} key={index}>
                        <p className={styles.inputWithCheckbox}  >{data.todo}</p>
                        <input className={styles.checkboxInside} type="checkbox" checked={data.checked} onChange={() => handleCheckboxChange(index)} />
                    </div>
                ))}
            </div>}
        <div className={styles.footer}>
            <div>{data.duedate && <button className={`${styles.date} ${data.status==='DONE' ? styles.done : ''} ${isDuePassed(data.duedate) ? styles.passed : ''}`}>{cardDate(data.duedate)}</button>}</div>
            <div className={styles.buttons}>
                {buttons.map((btn,index)=>(
                    <button key={index} onClick={()=>handleStatusChange(btn)}>{btn}</button>
                ))}
            </div>
        </div>
        {editpopup && <AddTodo onClose={()=>setEditpopup(false)} onupdatestatus={onupdatestatus} id={data._id} user={data.assignedto} />}
        <ToastContainer position="top-right" hideProgressBar={true} className={styles.tosterContainer}/>
        </div>
  )
}

export default TodoCard