import React from "react";
import api from "./api";

export default function NotesList({ notes, onUpdated, onDeleted, onEdit }) {
    const handleDelete = async (id) => {
        try {
            await api.delete(`/notes/${id}/`);
            onDeleted(id);
        } catch (err) {
            console.error("Failed to delete note:", err.response?.data || err);
        }
    };

    return (
        <div className="notes-grid">
            {notes.map((note) => (
                <div key={note.id} className="note-card">
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>

                    {/* ✅ Show tag_names instead of tags */}
                    {note.tag_names && note.tag_names.length > 0 && (
                        <div className="tags">
                            {note.tag_names.map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    <div className="actions">
                        <button onClick={() => onEdit(note)}>Edit</button>
                        <button type="button" onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}