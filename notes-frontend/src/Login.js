import React, { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/token/", { username, password });
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            // ✅ Pass only the access token back to parent
            onLogin(response.data.access);
        } catch (err) {
            console.error("Login failed:", err.response?.data || err);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                <div className="links">
                    <a href="/register">Register</a>
                    <a href="/forgot">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}