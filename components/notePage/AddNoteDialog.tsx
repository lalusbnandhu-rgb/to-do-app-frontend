"use client";

import { useEffect, useState } from "react";
import styles from "./AddNoteDialog.module.css";

interface AddNoteDialogProps {
  isOpen: boolean;
  initialTitle?: string;      // empty when adding, value when editing
  onCancel: () => void;
  onApply: (value: string) => void;
}

export default function AddNoteDialog({
  isOpen,
  initialTitle = "",
  onCancel,
  onApply,
}: AddNoteDialogProps) {
  const [value, setValue] = useState(initialTitle);

  // when dialog opens for a different note, sync local state
  useEffect(() => {
    if (isOpen) {
      setValue(initialTitle);
    }
  }, [initialTitle, isOpen]);   // re-run when title or open state changes[web:41]

  if (!isOpen) return null;

  const handleApply = () => {
    if (!value.trim()) return;
    onApply(value);
    // do NOT clear here; parent decides whether it’s add or edit
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3 className={styles.modalTitle}>
          {initialTitle ? "EDIT NOTE" : "NEW NOTE"}
        </h3>

        <textarea
          className={styles.modalInput}
          placeholder="Input your note..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
        />

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            CANCEL
          </button>
          <button className={styles.btnApply} onClick={handleApply}>
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
}
