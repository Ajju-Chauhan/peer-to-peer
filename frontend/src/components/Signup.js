import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import { Button, Container, Form, Alert, Spinner } from "react-bootstrap";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        if (!name || !email || !phone || !password) {
            setError("All fields are required.");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Invalid email format.");
            return false;
        }
        if (!/^\d{10}$/.test(phone)) {
            setError("Phone number must be 10 digits.");
            return false;
        }
        return true;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        if (!validateForm()) return;
        setLoading(true);
        try {
            await apiService.signup(name, email, phone, password);
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (error) {
            console.error("Signup error:", error);
            setError(error.response?.data?.message || "Error signing up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center">Signup</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter phone number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Button type="submit" className="w-100" variant="success" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Signup"}
                </Button>
            </Form>
        </Container>
    );
};

export default Signup;
