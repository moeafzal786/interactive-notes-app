import React, { useState } from "react";
import api from "./api";

export default function Register({ onRegistered }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post("/register/", { username, email, password });
            onRegistered();
        } catch (err) {
            console.error("Register failed:", err.response?.data || err);
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
            <div className="links">
                <a href="/login">Already have an account? Login</a>
            </div>
        </div>
    );
}