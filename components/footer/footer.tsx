"use client";

import React from "react";
import { GoPlusCircle } from "react-icons/go";
import styles from "./footer.module.css";

interface FooterProps {
  onAddClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAddClick }) => {
  return (
    <footer className={styles.footer}>
      <button
        className={styles.plusButton}
        onClick={onAddClick}
        aria-label="Add note"
      >
        <GoPlusCircle className={styles.plusIcon} />
      </button>
    </footer>
  );
};

export default Footer;
