import React, { useState } from "react";
import api from "./api";

export default function ResetPassword() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await api.post("/password-reset-confirm/", { username, password });
            alert("Password reset successful. Please login.");
        } catch (err) {
            console.error("Reset failed:", err.response?.data || err);
        }
    };

    return (
        <div className="auth-card">
            <h2>Set New Password</h2>
            <form onSubmit={handleReset}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <button type="submit">Reset Password</button>
            </form>
            <div className="links">
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
}