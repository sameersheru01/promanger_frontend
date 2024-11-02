import React, { useState } from 'react';
import styles from '../components/Settings.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineMail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { addtokentoheader } from '../helper/Helper';
import { toast, ToastContainer } from 'react-toastify';

function Settings() {
  const [formdata, setFormdata] = useState({
    name:"",
    email:"",
    oldpassword:"",
    newpassword:""
});
const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const handlechange = (e)=>{
      setFormdata({
    ...formdata,
    [e.target.name]: e.target.value,
  });
      setErrors({
          ...errors,
          [e.target.name]:'',
      })
  }
  const notify = () => {
    
    toast.dismiss();
    toast("Updated Sucessfully", {
        position: "top-right", 
        autoClose: 3000,
        closeButton: false,
        progress: false,
        className: styles.toast,
    });
};
  const submmited = async(e)=>{
    e.preventDefault();
    console.log(formdata)
    try {
      const headers =  addtokentoheader({headers:{}});
      const response = await axios.patch('http://localhost:5000/api/v1/update', formdata,{headers});
      
      console.log(response);
      if(response.status==201){ 
        localStorage.removeItem('token');
        navigate('/login');
      };
      setFormdata({
        name:"",
        email:"",
        oldpassword:"",
        newpassword:""
      });
      notify()
  } catch (error) {
      if (error.response && error.response.data.error) {
          setErrors(error.response.data.error);
          // console.log(errors);
      } else {
          setErrors({ server: 'An unexpected error occurred.' });
      }
      console.log(errors)
  }
  }
  return (
    <>
    <div className={styles.header}><p>Settings</p></div>
    <div className={styles.container}>
        <form onSubmit={submmited}>
            <div className={styles.inputbox}>
                <FaRegUser className={styles.inputicon}/>
                <input className={errors.name && styles.inputerror} type="text" name="name" placeholder='Name' value={formdata.name} onChange={handlechange}  />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div> 
            <div className={styles.inputbox}>
                <MdOutlineMail className={styles.inputicon}/>
            <input className={errors.email && styles.inputerror} type="email" name='email' placeholder='Email' value={formdata.email} onChange={handlechange} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>
            <div className={styles.inputbox}>
                <CiLock className={styles.inputicon}/>
            <input className={errors.oldpassword && styles.inputerror} type="text" name='oldpassword' placeholder='Old Password' value={formdata.oldpassword} onChange={handlechange} />
            {errors.oldpassword && <span className={styles.error}>{errors.oldpassword}</span>}
            </div>
             <div className={styles.inputbox}>
            <CiLock className={styles.inputicon}/>
                <input className={errors.newpassword && styles.inputerror} type="text" name="newpassword" placeholder='New Password' value={formdata.newpassword} onChange={handlechange} />
                {errors.newpassword && <span className={styles.error}>{errors.newpassword}</span>}
               {errors.server && <span className={styles.error}>{errors.server}</span>}
            </div> 
        <button type='submit' >Update</button>
        </form>
    </div>
    <ToastContainer position="top-right" hideProgressBar={true} className={styles.tosterContainer}/>
    </>
  )
}

export default Settings