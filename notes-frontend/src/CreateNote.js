import React, { useState } from "react";
import api from "./api";

export default function CreateNote({ onNoteCreated }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

        try {
            const response = await api.post("/notes/", {
                title,
                content,
                tags: tagsArray,
            });
            onNoteCreated(response.data);
            setTitle("");
            setContent("");
            setTags("");
        } catch (err) {
            console.error("Create failed:", err.response?.data || err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
            />
            <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
            />
            <button type="submit">Add Note</button>
        </form>
    );
}