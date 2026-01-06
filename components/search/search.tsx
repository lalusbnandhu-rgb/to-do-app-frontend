"use client";

import { useState } from "react";
import styles from "./search.module.css";
import { CiSearch } from "react-icons/ci";

type SearchProps = {
    onSearch: (value: string) => void;
};

export default function Search({ onSearch }: SearchProps) {
    const [value, setValue] = useState("");

    const handleSearch = () => {
        const trimmed = value.trim();
        onSearch(trimmed);
        setValue(""); // ✅ CLEAR input after search
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search Note.."
                className={styles.searchInput}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                }}
            />
            <CiSearch
                className={styles.searchIcon}
                onClick={handleSearch}
            />
        </div>
    );
}
