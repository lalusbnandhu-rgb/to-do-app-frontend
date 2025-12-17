import styles from "./search.module.css"

import { } from "react-icons";
import { CiSearch } from "react-icons/ci";


export default function Search() {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder="Search Note.."
                className={styles.searchInput} />
            <CiSearch className={styles.searchIcon}/>
        </div>

    );
}
