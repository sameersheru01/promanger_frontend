import React, { useState } from 'react';
import styles from '../components/TaskBar.module.css'
import { IoAddOutline } from "react-icons/io5";
import { LuCopyMinus } from "react-icons/lu";
import TodoCard from './TodoCard';
import AddTodo from './AddTodo';
import { filterTodos } from '../helper/Helper';

function TaskBar({todo, onupdatestatus ,filterType}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const taskbarname=Object.keys(todo)[0];
  const tasks = todo[taskbarname]
  const [dropdowns, setDropdowns] = useState(Array(tasks.length).fill(false));

  const filteredTodos = filterTodos(tasks, filterType);
  const handleCloseAllDropdowns = () => setDropdowns(Array(tasks.length).fill(false));
  const toggleDropdown = (index) => {
    const newStates = [...dropdowns];
    newStates[index] = !newStates[index];
    setDropdowns(newStates)
  }
  return (
    <div className={styles.container} >
        <div className={styles.taskbar}>
            <div className={styles.header}>
            <p>{taskbarname}</p>
            <div className={styles.icons}>
            {taskbarname==="To do" && <span onClick={() => setIsPopupOpen(true)}><IoAddOutline /></span>}
            <span><LuCopyMinus style={{ transform: 'scaleX(-1)' }}  onClick={handleCloseAllDropdowns} /></span>
            </div>
            </div>
            <div className={styles.cards}>
              {tasks.length > 0 && 
            filteredTodos.map((data,index)=>(<TodoCard key={index} data={data} toggleDropdown={() => toggleDropdown(index)} isDropdownOpen={dropdowns[index]} onupdatestatus={onupdatestatus} />))
            }

            </div>
        </div>
        {isPopupOpen && (
                <AddTodo 
                    onClose={() => setIsPopupOpen(false)} 
                    onupdatestatus={onupdatestatus} 
                />
            )}
    </div>
  )
}

export default TaskBar