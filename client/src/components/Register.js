import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:4001/register', { username, password, name, passwordConfirmation });
            if (response.data.register) {
                setMessage('회원가입 성공!');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('회원가입 중 오류 발생.');
            console.error("Error during registration:", error);
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <button onClick={handleRegister}>가입하기</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;
