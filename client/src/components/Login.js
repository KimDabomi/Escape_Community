import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const LoginContainer = styled.div`
  width: 100%;
`;


const Login = () => {
    const [loginUsername, setLoginUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { userId } = useParams();

    const LoginSubmit = async () => {
        try {
            const userData = {
                username: loginUsername,
                password: password,
                userId: userId
            }
            const response = await axios.post('http://localhost:4001/login', userData);
            if (response.data.success) {
                navigate('/'); // 메인 페이지로 리다이렉트
            } else {
                setErrors({ general: response.data.error });
            }
        } catch (error) {
            console.error("로그인 실패: ", error);
        }
    };
    


    return (
        <LoginContainer>
            <h2>로그인</h2>
            {errors.general && <p>{errors.general}</p>}
            <input
                type="text"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={LoginSubmit}>로그인</button>
        </LoginContainer>
    );
};

export default Login;
