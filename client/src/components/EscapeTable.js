import React, { useState, useEffect } from 'react';

const EscapeTable = (() => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch('/api/thema')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                return response.text().then(text => {
                    throw new Error(`JSON 아님: ${text}`);
                });
            }
            return response.json();
        })
        .then(rawData => {
            const transformedData = rawData.map(item => {
                const transformedValue = item.value.map(themeResultObj => {
                    return themeResultObj[Object.keys(themeResultObj)[0]];
                });
                return {
                    key: item.key,
                    value: transformedValue
                };
            });
            setData(transformedData);
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error.message));
    }, []);
    
    

    return (
        <div>
            {data.map(item => (
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
                                <th>Review Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{item.region}</td>
                                <td>{item.store}</td>
                                <td>{item.name}</td>
                                <td>{item.star}</td>
                                <td>{item.level}</td>
                                <td>{item.review_cnt}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
      
});

export default EscapeTable;
