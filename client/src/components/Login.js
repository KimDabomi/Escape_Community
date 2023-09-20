import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const LoginContainer = styled.div`
  width: 100%;
  .login_complete {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.7);
    padding-top: 120px;
    box-sizing: border-box;
    z-index: 99999;
    .popup {
      background-color: #fff;
      width: 350px;
      height: 180px;
      margin: auto;
      transform: translate(0, 50%);
      text-align: center;
      padding-top: 35px;
      box-sizing: border-box;

      // 닫기버튼
      button {
        margin-top: 25px;
        background-color: rgb(0, 148, 251);
        border: none;
        color: white;
        padding: 10px 25px;
        font-size: 15px;
        font-weight: 100;
        border-radius: 3px;
      }
    }
  }
`;


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const LoginSumbit = async () => {
        try {
            const userData = {
                username: username,
                password: password
            }
            const response = await axios.post('http://localhost:4001/login', userData);
            if (response.data.success) {
                document.querySelector(".login_complete").style.display = "block";
            } else {
                setErrors({ general: response.data.error });
            }
        } catch (error) {
            console.error("로그인 실패: ", error);
        }
    };

    // 팝업닫기
    const closeBox = (e) => {
        document.querySelector(".login_complete").style.display = "none";
        navigate('/');
    };



    return (
        <LoginContainer>
            <form className="login_complete">
                <div className="popup">
                    <p>
                        로그인에 성공했습니다.
                    </p>
                    <button type="button" className="close" onClick={closeBox}>
                        닫기
                    </button>
                </div>
            </form>
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
            <button onClick={LoginSumbit}>로그인</button>
        </LoginContainer>
    );
};

export default Login;
