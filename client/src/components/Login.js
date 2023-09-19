import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:4001/login', { username, password });
            if (response.data.success) {
                navigate('/');
            } else {
                setErrors({ general: response.data.error });
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    };

    return (
        <div>
            <h2>로그인</h2>
            {errors.general && <p>{errors.general}</p>}
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
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default Login;
