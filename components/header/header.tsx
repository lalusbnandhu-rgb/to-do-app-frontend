import { IoMdLogOut } from "react-icons/io";
import styles from "./header.module.css";

type HeaderProps = {
  onLogout: () => void;
  userEmail?: string;
};

export default function Header({ onLogout, userEmail }: HeaderProps) {
  return (
    <div className={styles.headerContainer}>
      {/* centered title */}
      <div className={styles.headerCenter}>
        <h1 className={styles.headerTitle}>Welcome to Notepad!</h1>
      </div>

      {/* right side: username then logout button */}
      <div className={styles.headerRight}>
        {userEmail && (
          <span className={styles.userName}>{userEmail}</span>
        )}
        <button className={styles.logoutButton} onClick={onLogout}>
          <IoMdLogOut />
        </button>
      </div>
    </div>
  );
}
