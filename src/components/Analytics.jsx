// Analytics.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Analytics.module.css';
import { addtokentoheader } from '../helper/Helper';
import { GoDotFill } from 'react-icons/go';

const Analytics = () => {
  const [data, setData] = useState({
    counts: {
      backlogCount: 0,
      toDoCount: 0,
      inProgressCount: 0,
      doneCount: 0,
    },
    totalPriorityCounts: {
      high: 0,
      moderate: 0,
      low: 0,
    },
    totalDueDateCount: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
          try {
            const headers =  addtokentoheader({headers:{}});
            const response = await axios.get('http://localhost:5000/api/taskCounts',{headers});
            
            setData(response.data)
            console.log(response.data)
            
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
        fetchUserData()
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Analytics</h2>
      <div className={styles.analyticsBox}>
        <div className={styles.tasks}>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>Backlog Tasks</span> <span className={styles.count}>{data.counts.backlogCount}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>To-do Tasks</span> <span className={styles.count}>{data.counts.toDoCount}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>In-Progress Tasks</span> <span className={styles.count}>{data.counts.inProgressCount}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>Completed Tasks</span> <span className={styles.count}>{data.counts.doneCount}</span></p>
          
        </div>
        <div className={styles.tasks}>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>Low Priority</span> <span className={styles.count}>{data.totalPriorityCounts.low}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>Moderate Priority</span> <span className={styles.count}>{data.totalPriorityCounts.moderate}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>High Priority</span> <span className={styles.count}>{data.totalPriorityCounts.high}</span></p>
            <p><span className={styles.title} ><GoDotFill size={20} style={{ color: '#90C4CC'}}/>Due Date Tasks</span> <span className={styles.count}>{data.totalDueDateCount}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;