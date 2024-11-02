import React, { useState } from 'react';
import styles from '../components/popup.module.css';
import axios from 'axios';
import { addtokentoheader } from '../helper/Helper';

function Popup({ type, onClose, logout, deleteItem }) {
    const [step, setStep] = useState('add'); 
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleAddClick = async (e) => {
        e.preventDefault(); 
        const emailId = email;

        try {
            const headers = addtokentoheader({ headers: {} });
            const response = await axios.post(`http://localhost:5000/api/v1/addtoboard`, { emailId }, { headers });
            
            console.log(response.data);
            if (response.status === 200) {
                setStep('confirm'); 
            }
        } catch (error) {
            setError(error.response ? error.response.data.error : "Error adding board member");
            console.error("Error adding board member:", error);
        }
    };

    const handleConfirmClick = () => {
        setStep('add'); 
        setEmail('');   
        onClose();      
    };

    const handleType = () => {
        type === 'Logout' ? logout() : deleteItem();
    };

    return (
        <div className={styles.overlay}>
            {type === 'Logout' || type === 'Delete' ? (
                <div className={styles.popuplogout}>
                    <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
                        <p className={styles.logout}>Are you sure you want to {type}?</p>
                        <button onClick={handleType}>Yes, {type}</button>
                        <button onClick={onClose} className={styles.cancel}>Cancel</button>
                    </form>
                    {error && <span className={styles.error}>{error}</span>}
                </div>
            ) : (
                <div className={styles.popup}>
                    {step === 'add' ? (
                        <div className={styles.addpeople}>
                            <p>Add people to the board</p>
                            <form onSubmit={handleAddClick} className={styles.form}>
                                <input
                                    type="email"
                                    name="itemName"
                                    placeholder='Enter the email'
                                    onChange={handleEmailChange}
                                    value={email} 
                                    required
                                />
                                <div className={styles.buttons}>
                                    <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
                                    <button type="submit">Add Email</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className={styles.confirm}>
                            <p>{email} added to board</p>
                            <form>
                                <button type="button" onClick={handleConfirmClick}>Okay, got it!</button>
                            </form>
                        </div>
                    )}
                    {error && <span className={styles.error}>{error}</span>}
                </div>
            )}
        </div>
    );
}

export default Popup;
