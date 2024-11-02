import React, { useEffect, useState } from 'react'
import styles from './CardPage.module.css'
import { GoDotFill } from 'react-icons/go';
import { cardDate } from '../helper/Helper';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CardPage() {
    const { id } = useParams(); 
  const [data, setData] = useState([]);
    const priorityColors = {
        "HIGH PRIORITY": "#FF2473",
        "MODERATE PRIORITY": "#18B0FF",
        "LOW PRIORITY": "#63C05B"
    };
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/api/todos/${id}`);
            console.log(response.data)
            setData(response.data || []);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [id]);
      console.log(data)
      const totalCheckboxes = data?.checklist?.length;
      const checkedCount = data?.checklist?.reduce((count, item) => item.checked ? count + 1 : count, 0);
  return (
    <div className={styles.container}>
        <div className={styles.title}>
        <span className={styles.image}></span>
        <p>Pro Manage</p>
      </div>
      <div className={styles.card} >
        <div className={styles.head}>
        <span><GoDotFill size={15} style={{ color: priorityColors[data.priority?.trim().toUpperCase()]  }}/><p>{data.priority}</p></span>
        </div>
        <p className={styles.cardtitle}>{data.title}</p>
        <p className={styles.listcount}>Checklist ({checkedCount}/{totalCheckboxes})</p>
      <div className={styles.todos}>
                {data?.checklist?.map((data,index)=>(
                    <div className={styles.inputcontainer} key={index}>
                        <p className={styles.inputWithCheckbox}  >{data.todo}</p>
                        <input className={styles.checkboxInside} type="checkbox" checked={data.checked} />
                    </div>
                ))}
      </div>
       {data.duedate && <div className={styles.due}>Due Date <button className={styles.date}>{cardDate(data.duedate)}</button></div>}
      </div>
    </div>
  )
}

export default CardPage;