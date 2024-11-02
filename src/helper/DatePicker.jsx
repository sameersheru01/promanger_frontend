import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoMdArrowUp, IoMdArrowDown, IoMdArrowDropdown } from "react-icons/io";
import styles from './DatePicker.module.css';
import './DatePicker.css';
import outsidecliker from '../helper/outsidecliker';

const DatePickerComponent = ({ onChange, value }) => {
    const today = new Date();
    const [startDate, setStartDate] = useState(value instanceof Date && !isNaN(value) ? value : null);
    const [selectedYear, setSelectedYear] = useState(startDate ? startDate.getFullYear() : today.getFullYear());
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const selectedYearRef = useRef(null);
    const dropdownRef = useRef(null);
    // console.log(value)

    useEffect(() => {
        if (value instanceof Date && !isNaN(value)) {
            setStartDate(value);
            setSelectedYear(value.getFullYear());
        }
    }, [value]);

    const years = Array.from({ length: 201 }, (_, index) => 1900 + index);

    useEffect(() => {
        if (showYearDropdown && selectedYearRef.current) {
            selectedYearRef.current.scrollIntoView({ block: 'center' });
        }
    }, [showYearDropdown]);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        const newDate = new Date(year, startDate ? startDate.getMonth() : today.getMonth(), startDate ? startDate.getDate() : today.getDate());
        setStartDate(newDate);
        onChange(newDate);
        setShowYearDropdown(false);
    };
    
    outsidecliker(dropdownRef, () => setShowYearDropdown(false));

    return (
        <div className={styles.datePickerContainer}>
            <DatePicker
                selected={startDate || value} 
                onChange={(date) => {
                    setStartDate(date);
                    setSelectedYear(date.getFullYear());
                    onChange(date);
                }}
                placeholderText="Select due date"
                dateFormat="MM/dd/yyyy"
                showPopperArrow={false}
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                    <div className={styles.customHeader}>
                        <span className={styles.monthYear}>
                            {date.toLocaleString('default', { month: 'long' })},
                        </span>
                        <div className={styles.yearSelector}>
                            <div 
                                className={styles.yearDropdownButton}
                                onClick={() => setShowYearDropdown((prev) => !prev)}
                            >
                                {selectedYear} <IoMdArrowDropdown />
                            </div>
                            {showYearDropdown && (
                                <div className={styles.yearDropdown} ref={dropdownRef}>
                                    {years.map((year) => (
                                        <div 
                                            key={year} 
                                            ref={year === selectedYear ? selectedYearRef : null}
                                            onClick={() => handleYearSelect(year)}
                                            className={`${styles.yearItem} ${year === selectedYear ? styles.selectedYear : ''}`}
                                        >
                                            {year}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className={styles.navButtons}>
                            <button
                                type="button"
                                onClick={decreaseMonth}
                                className={styles.navButton}
                            >
                                <IoMdArrowUp />
                            </button>
                            <button
                                type="button"
                                onClick={increaseMonth}
                                className={styles.navButton}
                            >
                                <IoMdArrowDown />
                            </button>
                        </div>
                    </div>
                )}
                calendarContainer={({ children }) => (
                    <div className={styles.customCalendarContainer}>
                        {children}
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.clearButton}
                                onClick={() => {
                                    setStartDate(null);
                                    onChange(null);
                                }}
                            >
                                Clear
                            </button>
                            <button
                                className={styles.todayButton}
                                onClick={() => {
                                    setStartDate(today);
                                    setSelectedYear(today.getFullYear());
                                    onChange(today);
                                }}
                            >
                                Today
                            </button>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default DatePickerComponent;
