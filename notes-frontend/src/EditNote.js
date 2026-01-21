import React, { useState } from "react";
import api from "./api";

export default function EditNote({ note, onUpdated, onCancel }) {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [tags, setTags] = useState(note.tag_names?.join(", ") || "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

        try {
            const response = await api.put(`/notes/${note.id}/`, {
                title,
                content,
                tags: tagsArray,   // ✅ send array
            });
            onUpdated(response.data);
        } catch (err) {
            console.error("Update failed:", err.response?.data || err);
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
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}