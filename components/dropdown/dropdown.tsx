"use client";
import { useState, ChangeEvent, FC } from 'react';
import styles from "./dropdown.module.css"

const Dropdown: FC = () => {
    const [status, setStatus] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setStatus(e.target.value);
    };

    return (

        <div className = {styles.dropdownContainer}>
            <select
                id="status"
                value={status}
                onChange={handleChange}
                className= {styles.statuSelect}
            >
                <option value="todo">All</option>
                <option value="in-progress">Todo</option>
                <option value="done">Done</option>
            </select>
        </div>
    );
};

export default Dropdown;

