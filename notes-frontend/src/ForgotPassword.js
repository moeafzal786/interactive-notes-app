import React, { useState } from "react";
import api from "./api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleForgot = async (e) => {
        e.preventDefault();
        try {
            await api.post("/password-reset/", { email });
            alert("Reset link sent to your email");
        } catch (err) {
            console.error("Reset failed:", err.response?.data || err);
        }
    };

    return (
        <div className="auth-card">
            <h2>Reset Password</h2>
            <form onSubmit={handleForgot}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Send Reset Link</button>
            </form>
            <div className="links">
                <a href="/login">Back to Login</a>
            </div>
        </div>
    );
}