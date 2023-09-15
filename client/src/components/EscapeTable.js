import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EscapeTable = (() => {
    const [themaList, setThemaList] = useState([]);

    useEffect(() => {
       const fetchData = async () => {
          try {
             const response = await axios.get('http://localhost:4001/api/thema');
             setThemaList(response.data.aThema);
          } catch (error) {
             console.error("Error fetching data:", error);
          }
       };
       fetchData();
    }, []);
 

    return (
        <>
            <div>
                {themaList && (themaList.map(item => (
                    <div key={item.name}>
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
