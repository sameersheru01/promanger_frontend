import React, { useEffect, useRef, useState } from 'react';
import styles from '../components/AddTodo.module.css';
import { GoDotFill } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { addtokentoheader, getCurrentUserId, GetInitials } from '../helper/Helper';
import axios from 'axios';

import outsidecliker from '../helper/outsidecliker';
import DatePickerComponent from '../helper/DatePicker';

function AddTodo({onClose,onupdatestatus, id,user}) {
    const [checklist,setChecklist]=useState([]);
    const [users,setUsers]=useState([]);
    const [errors,setErrors]=useState({})
    const [formdata,setFormdata]=useState({
        title:"",
        priority:"",
        assignedto:"",
        duedate:""
    });
    const totalCheckboxes = checklist.length;
    const checkedCount = checklist.reduce((count, item) => item.checked ? count + 1 : count, 0);
    const dropdownRef = useRef(null);
    const currentuserid = getCurrentUserId()
    
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const headers =  addtokentoheader({headers:{}});
                const response = await axios.get('http://localhost:5000/api/v1/users',{headers}); 
                setUsers(response.data); 
            } catch (err) {
                setErrors(err.message); 
            } 
        };

        fetchUsers(); 
    }, []);
    useEffect(() => {
        const fetchTodoData = async () => {
            if (id) {
                try {
                    const headers = addtokentoheader({ headers: {} });
                    const response = await axios.get(`http://localhost:5000/api/todos/${id}`, { headers });
                    const todoData = response.data;

                    setFormdata({
                        title: todoData.title,
                        priority: todoData.priority,
                        assignedto: todoData.assignedto,
                        duedate: todoData.duedate
                    });
                    setChecklist(todoData.checklist);
                } catch (err) {
                    setErrors({ server: err.message });
                }
            }
        };

        fetchTodoData();
    }, [id]);

    const priorities = [
        { label: "HIGH PRIORITY", value: "HIGH PRIORITY", color: "#FF2473" },
        { label: "MODERATE PRIORITY", value: "MODERATE PRIORITY", color: "#18B0FF" },
        { label: "LOW PRIORITY", value: "LOW PRIORITY", color: "#63C05B" }
    ];

    const [isopen,setIsopen]=useState(false)

    outsidecliker(dropdownRef, () => setIsopen(false));

    const handleSelect = (option)=>{

        const updatedFormdata = { 
            ...formdata, 
            assignedto: option 
        };
        setFormdata(updatedFormdata)
        setIsopen(false)
    }
    const handlePrioritySelect = (priority) => {
        setFormdata((prevData) => ({
            ...prevData,
            priority: priority
        }));
    };
    const handleSave = async()=>{
        let data = {...formdata,checklist}
        
        if(!id){
            try {
                const headers =  addtokentoheader({headers:{}});
                
                const response = await axios.post('http://localhost:5000/api/create', data, { headers });
                
                if(response.status==200){
                    
                    setChecklist([]);
                    setFormdata({
                        title:"",
                        priority:"",
                        assignedto:"",
                        duedate:""
                    });
                    onClose();
                    onupdatestatus();
                }
            } catch (error) {
                // console.log(error)
                if (error.response && error.response.data.error) {
                    setErrors(error.response.data.error);
                    // console.log(error.response.data.error);
                } else {
                    setErrors({ server: 'An unexpected error occurred.' });
                }
            }
        }
        else{
            try {
                const headers =  addtokentoheader({headers:{}});
                
                const response = await axios.patch(`http://localhost:5000/api/update/${id}`, data, { headers });
                
                if(response.status==200){
                    console.log(data)
                    setChecklist([]);
                    setFormdata({
                        title:"",
                        priority:"",
                        assignedto:"",
                        duedate:""
                    });
                    onClose();
                    onupdatestatus();
                }
            } catch (error) {
                // console.log(error)
                if (error.response && error.response.data.error) {
                    setErrors(error.response.data.error);
                    // console.log(error.response.data.error);
                } else {
                    setErrors({ server: 'An unexpected error occurred.' });
                }
            }
        }
    }
    const handleAdd = ()=>{
        setChecklist([...checklist, { todo: '', checked: false }]);
    }
    const handleDelete = (index)=>{
        const deletedInput = checklist.filter((_, i) => i !== index);
        
        setChecklist(deletedInput);
    }
    const handleInputChange= (index,value)=>{
        const newInputs = [...checklist];
    newInputs[index].todo = value; 
    setChecklist(newInputs);
    }

    const handleCheckboxChange = (index) => {
        const newInputs = [...checklist];
        newInputs[index].checked = !newInputs[index].checked; 
        setChecklist(newInputs); 
      };
      const handleClick = () => {
        setIsopen(!isopen);
    };
  return (
    <div className={styles.overlay}>
        <div className={styles.popup} >
            <div className={styles.title}>
            <label>Title <span>*</span></label>
            <input className={errors.title && styles.inputerror} type="text" name='title' placeholder='Enter Task Title' value={formdata.title} onChange={(e) => setFormdata({...formdata,[e.target.name]:e.target.value})} />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
            </div>
            <div className={styles.priority}>
                <label >Select Priority <span>*</span></label>
                {priorities.map((priority) => (
            <button
                key={priority.value}
                onClick={() => handlePrioritySelect(priority.value)}
                className={`${styles.priorityButton} ${formdata.priority === priority.value ? styles.activeButton : ""}`}
            >
                <GoDotFill style={{ color: priority.color }} /> {priority.label}
            </button>
            ))}
            {errors.priority && <span className={styles.error}>{errors.priority}</span>}
            </div>
            <div className={styles.assign}>
                <p>Assign to</p>
                <div className={`${styles.assignbar} ${formdata.assignedto && styles.active}`}  onClick={id ? (currentuserid !== user ? handleClick : undefined) : handleClick}>
                    {formdata.assignedto || "Add a assignee"}
                </div>
                {isopen && 
                <div ref={dropdownRef} className={styles.dropdown}>
                {users.map((option, index) => (
                    <div
                    key={index}
                    className={styles.option}
                    >
                    <div className={styles.mail}><span>{GetInitials(option.email)}</span>{option.email}</div> <button onClick={() => handleSelect(option.email)}>Assign</button>
                    </div>
                ))}
                </div>}
            </div>
                <label>Checklist ({checkedCount}/{totalCheckboxes}) <span>*</span></label>
            <div className={styles.todos}>
                {checklist.map((input,index)=>(
                    <div className={styles.inputcontainer} key={index}>
                    <input type="text" placeholder='Add a task' name='todo' value={input.todo} onChange={(e) => handleInputChange(index, e.target.value)} className={styles.inputWithCheckbox}/>
                    <input type="checkbox" checked={input.checked} onChange={() => handleCheckboxChange(index)} className={styles.checkboxInside}/>
                    <MdDelete size={20} className={styles.icon} onClick={()=>handleDelete(index)}/>
                </div>
                ))}
            </div>
                <button onClick={handleAdd} className={styles.addbutton}>+ Add New
                <br />
                {errors.checklist && <span className={styles.checklisterror}>{errors.checklist}</span>}
                </button>
            <div className={styles.bottom}>
                {/* <input type="date" value={formdata.duedate} onChange={(e)=>{setFormdata((pre)=>({...pre,duedate:e.target.value}))}} /> */}
                <div className={styles.date}>
                <DatePickerComponent 
    value={formdata.duedate ? new Date(formdata.duedate).toLocaleDateString('en-US') : null} 
    onChange={(date) => {
      const formattedDate = new Date(date).toLocaleDateString('en-US');
      setFormdata({ ...formdata, duedate: formattedDate });
    }}
  />

                    </div>
                <div className={styles.buttons}>
                    <button className={styles.cancel} onClick={()=>onClose()}>cancel</button>
                    <button onClick={handleSave} className={styles.save}>Save</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddTodo;