"use client";

import { useState } from "react";
import Dropdown from "@/components/dropdown/dropdown";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import Search from "@/components/search/search";
import ThemeToggle from "@/components/ThemeToggle/Themetoggle";
import AddNoteDialog from "@/components/notePage/AddNoteDialog";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";

type Note = {
  title: string;
  done: boolean;
};

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  // null = adding, number = editing that index
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const toggleNote = (index: number) => {
    setNotes(prev =>
      prev.map((note, i) =>
        i === index ? { ...note, done: !note.done } : note
      )
    );
  };

  // create or update depending on editingIndex
  const handleSaveNote = (title: string) => {
    if (editingIndex === null) {
      // ADD
      setNotes(prev => [...prev, { title, done: false }]);
    } else {
      // EDIT
      setNotes(prev =>
        prev.map((note, i) =>
          i === editingIndex ? { ...note, title } : note
        )
      );
    }
    setIsDialogOpen(false);
    setEditingIndex(null);
  };

  const startCreate = () => {
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleCancelDialog = () => {
    setIsDialogOpen(false);
    setEditingIndex(null);
  };

  return (
    <div>
      <Header />
      <div>
        <div className="header">
          <h3>TODO LIST</h3>
        </div>

        <div className="sub-header">
          <Search />
          <Dropdown />
          <ThemeToggle />
        </div>

        <div className="page-container">
          <ul className="checklist">
            {notes.map((note, index) => (
              <li
                key={index}
                className={`todoItem ${note.done ? "todoItem--done" : ""}`}
              >
                {/* LEFT SIDE */}
                <div className="todoLeft">
                  <input
                    type="checkbox"
                    checked={note.done}
                    onChange={() => toggleNote(index)}
                    className="todoCheckbox"
                  />
                  <span className="todoText">{note.title}</span>
                </div>

                {/* RIGHT SIDE */}
                <div className="todoActions">
                  <button
                    className="todoIcon"
                    onClick={() => startEdit(index)}   // open dialog for this note
                  >
                    <MdOutlineEdit />
                  </button>
                  <button
                    className="todoIcon"
                    onClick={() =>
                      setNotes(prev => prev.filter((_, i) => i !== index))
                    }
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AddNoteDialog
        isOpen={isDialogOpen}
        // when editing, pass the current title; when adding, empty string
        initialTitle={
          editingIndex !== null ? notes[editingIndex]?.title ?? "" : ""
        }
        onCancel={handleCancelDialog}
        onApply={handleSaveNote}
      />

      <Footer onAddClick={startCreate} />
    </div>
  );
}
