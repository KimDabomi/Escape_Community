import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EscapeTable = (() => {
    const [themaList, setThemaList] = useState([]);
    const [username, setUsername] = useState('');


    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const response = await axios.get('http://localhost:4001/api/session', { withCredentials: true });
                console.log('-------------------response',response);
                setUsername(response.data.username);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error("세션 만료 또는 로그인되지 않음");
                } else {
                    console.error("세션 사용자 정보 불러오기 실패: ", error);
                }
            }
        };
       fetchSessionUser();
    }, []);


    useEffect(() => {
       const fetchData = async () => {
          try {
             const response = await axios.get('http://localhost:4001/api/thema');
             setThemaList(response.data.aThema);
          } catch (error) {
             console.error("테마데이터 불러오기 실패: ", error);
          }
       };
       fetchData();
    }, []);

    const LogoutSubmit = async () => {
        try {
            await axios.post('http://localhost:4001/logout');
            setUsername(null);
        } catch (error) {
            console.error("로그아웃 실패: ", error);
        }
    };
    
 

    return (
        <>
            <div>
                {username ? (
                    <>
                        <h2>환영합니다. {username}님!</h2>
                        <button onClick={LogoutSubmit}>로그아웃</button>
                    </>
                ) : (
                    <h2>환영합니다.</h2>
                )}  
                {themaList && (themaList.map((item, index) => (
                    <div key={index}>
                        <h2>{item.region}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Region</th>
                                    <th>Store</th>
                                    <th>Name</th>
                                    <th>Star</th>
                                    <th>Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{item.region}</td>
                                    <td>{item.store}</td>
                                    <td>{item.name}</td>
                                    <td>{item.star}</td>
                                    <td>{item.level}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )))}
            </div>
        </>
    );
      
});

export default EscapeTable;
