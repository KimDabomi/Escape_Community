import React, { useState, useEffect } from 'react';

const EscapeTable = (() => {
    const [themaList, setThemaList] = useState([]);
    const requestOptions = {
        headers: { 'Content-Type': 'application/json' }
    };
    useEffect(() => {
        fetch('/api/thema',requestOptions)
          .then(response => response.json())
          .then(data => setThemaList(data.aThema))
          .catch(error => console.error('Error fetching thema:', error));
      }, []);

    return (
        <div>
            {themaList.map(item => (
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
            ))}
        </div>
    );
      
});

export default EscapeTable;
