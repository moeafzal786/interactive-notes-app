import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NotesList from "./NotesList";
import CreateNote from "./CreateNote";
import EditNote from "./EditNote";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import api from "./api";
import "./App.css";

function App() {
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access"));

    useEffect(() => {
        if (token) {
            api
                .get("/notes/", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setNotes(res.data))
                .catch((err) => console.error("Failed to fetch notes:", err));
        }
    }, [token]);

    const handleNoteCreated = (note) => setNotes([...notes, note]);

    const handleNoteUpdated = (updatedNote) => {
        setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
        setEditingNote(null);
    };

    const handleNoteDeleted = (id) =>
        setNotes(notes.filter((n) => n.id !== id));

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setToken(null); // ✅ go back to login
    };

    return (
        <Router>
            {!token ? (
                // 🔐 Auth routes
                <Routes>
                    <Route path="/login" element={<Login onLogin={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<ForgotPassword />} />
                    <Route path="/reset" element={<ResetPassword />} />
                    {/* Default route → Login */}
                    <Route path="*" element={<Login onLogin={setToken} />} />
                </Routes>
            ) : (
                // 📒 Notes routes
                <div className="App">
                    <h1>Notes App (Web)</h1>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                editingNote ? (
                                    <EditNote
                                        note={editingNote}
                                        onUpdated={handleNoteUpdated}
                                        onCancel={() => setEditingNote(null)}
                                    />
                                ) : (
                                    <>
                                        <CreateNote onNoteCreated={handleNoteCreated} />
                                        <NotesList
                                            notes={notes}
                                            onUpdated={handleNoteUpdated}
                                            onDeleted={handleNoteDeleted}
                                            onEdit={setEditingNote}
                                        />
                                    </>
                                )
                            }
                        />
                    </Routes>
                </div>
            )}
        </Router>
    );
}

export default App;