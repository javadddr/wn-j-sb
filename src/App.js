import React, { useState, useEffect } from 'react';
import Wn from './Wn';
import Wn2 from './Wn2';
import './App.css'

const App = () => {
    const [apiKey, setApiKey] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [showComponent, setShowComponent] = useState('Wn'); // New state variable

    useEffect(() => {
        const storedApiKey = localStorage.getItem('BeesKey');
        if (storedApiKey) {
            setApiKey(storedApiKey);
        } else {
            setShowPopup(true);
        }
    }, []);

    const handleApiKeySubmit = (key) => {
        localStorage.setItem('BeesKey', key);
        setApiKey(key);
        setShowPopup(false);
    };

    return (
        <div>
            {showPopup && (
               <div className="popup-backdrop">
               <div className="popup">
               <div className='enapi'>
                    Enter your API Key 
                    <span className="question-icon">?</span>
                    <span className="tooltip-text">For obtaining API Key contact sk@scrapbees.com</span>
                    </div>

                   <input
                       type="text"
                       placeholder="Enter API Key"
                       value={apiKey}
                       onChange={(e) => setApiKey(e.target.value)}
                   />
                   <button onClick={() => handleApiKeySubmit(apiKey)}>Submit</button>
               </div>
           </div>
           
            )}
            <div className="toggle-buttons">
            <button
                onClick={() => setShowComponent('Wn')}
                className={`toggle-button ${showComponent === 'Wn' ? 'active' : ''}`}
            >
                Wiegeschein (Delivery Notes)
            </button>
            <button
                onClick={() => setShowComponent('Wn2')}
                className={`toggle-button ${showComponent === 'Wn2' ? 'active' : ''}`}
            >
                Gutschrift (Creditnotes)
            </button>
            </div>

            {showComponent === 'Wn' && <Wn apiKey={apiKey}/>}
            {showComponent === 'Wn2' && <Wn2 apiKey={apiKey}/>}
        </div>
    );
};

export default App;
