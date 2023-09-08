import React, { useState, useEffect } from 'react';

const EscapeTable = (() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/thema')
        .then(response => {
            if (!response.ok || response.headers.get('Content-Type') !== 'application/json') {
                throw new Error('Invalid server response');
            }
            return response.json();
        })
        .then(data => setData(data))
        .catch(error => console.error('There was a problem with the fetch operation:', error.message));
    
    }, []);
    

    return (
        <div>
            {data.map(item => (
                <div key={item.key}>
                    <h2>{item.key}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Store</th>
                                <th>Name</th>
                                <th>Star</th>
                                <th>Level</th>
                                <th>Review Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.value.map(themeResult => (
                                <tr key={themeResult.name}>
                                    <td>{themeResult.store}</td>
                                    <td>{themeResult.name}</td>
                                    <td>{themeResult.star}</td>
                                    <td>{themeResult.level}</td>
                                    <td>{themeResult.review_cnt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
});

export default EscapeTable;
