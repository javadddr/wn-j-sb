import React, { useEffect, useState } from 'react';

const Testforapi = () => {
    const [postData, setPostData] = useState({
        "issuedAt": "2023-12-21",
        "lineItems": [
            {
                "dropoffMaterialId": 793,
                "weight": 2.0,
                "pricePerTon": 225000,
                "total": 450000
            },
            {
                "dropoffMaterialId": 791,
                "weight": 10.0,
                "pricePerTon": 610000,
                "total": 6100000
            }
        ]
    });

    useEffect(() => {
        const makeApiCall = async () => {
            const url = 'https://api-dev.scrapbees.com/logistics/dropoffs/188/documents/creditnotes';
            const token = 'Bearer your_token_here'; // Replace with your actual token

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(postData)
                });

                const data = await response.json();
                console.log(data); // Handle the response data
            } catch (error) {
                console.error("Error making POST request:", error);
            }
        };

        makeApiCall();
    }, [postData]);

    return (
        <div>
            {/* Your component UI here */}
        </div>
    );
};

export default Testforapi;
