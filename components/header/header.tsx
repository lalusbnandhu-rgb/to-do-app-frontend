import styles from "./header.module.css";

export default function Header() {
  return (
    <div className={styles.headerContainer}>
      <header />
      <p>Welcome to Notepad!</p>
    </div>
  );
}