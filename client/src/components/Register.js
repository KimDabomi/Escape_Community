import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";

const RegisterContainer = styled.div`
  width: 100%;
  .register_complete {
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

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const RegisterSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:4001/register', { username, password, name, passwordConfirmation });
            if (response.data.register) {
                document.querySelector(".register_complete").style.display = "block";
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage('회원가입 중 오류 발생.');
            console.error("회원가입 실패: ", error);
        }
    };

    // 팝업닫기
    const closeBox = (e) => {
        document.querySelector(".register_complete").style.display = "none";
        navigate('/login');
    };

    return (
        <RegisterContainer>
            <form className="register_complete">
                <div className="popup">
                    <p>
                        회원가입에 성공했습니다.
                    </p>
                    <button type="button" className="close" onClick={closeBox}>
                        닫기
                    </button>
                </div>
            </form>
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
            <button onClick={RegisterSubmit}>가입하기</button>
            {message && <p>{message}</p>}
        </RegisterContainer>
    );
};

export default Register;
