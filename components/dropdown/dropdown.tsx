"use client";
import { ChangeEvent, FC } from "react";
import styles from "./dropdown.module.css";

type DropdownProps = {
  value: "all" | "todo" | "done";
  onChange: (value: "all" | "todo" | "done") => void;
};

const Dropdown: FC<DropdownProps> = ({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as "all" | "todo" | "done");
  };

  return (
    <div className={styles.dropdownContainer}>
      <select
        value={value}
        onChange={handleChange}
        className={styles.statuSelect}
      >
        <option value="all">All</option>
        <option value="todo">Incomplete</option>
        <option value="done">Complete</option>
      </select>
    </div>
  );
};

export default Dropdown;
