import React, { useState,useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import dropoffMaterials from './DropoffMaterials';
import './Wn.css';
import trash from "./trash-bin.png"
import logo from './logoi.jpg';
//dooooone
const Wn = () => {
  const initialLineItems = () => new Array(3).fill(null).map(() => ({
    materialClassId: '',
    materialDisplayName: '', 
    mappedMaterialId: '',
    weight: '',
    pricePerTon: '',
    totalSum: ''
}));
const [dropoffId, setDropoffId] = useState('');
const [dropoffData, setDropoffData] = useState([]);
useEffect(() => {
    const fetchDropoffs = async () => {
        try {
            const response = await fetch('https://api-dev.scrapbees.com/logistics/dropoffs', {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlIjoib3BlcmF0aW9ucyIsImVtYWlsIjoiamF2YWQuYXJqbWFuZGlAc2NyYXBiZWVzLmNvbSIsImlhdCI6MTcwNDk3MDM5MywiZXhwIjoxNzA1OTc4MzkzfQ.KrCootNZeLZdQK1tRWD01by2b67XU1oZUUYuL8x7nmg'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setDropoffData(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchDropoffs();
}, []);


const [dropoffMaterialsData, setDropoffMaterialsData] = useState([]);

useEffect(() => {
    // Function to fetch dropoff materials
    const fetchDropoffMaterials = async () => {
        if (!dropoffId) {
            return; // If there's no dropoffId, don't fetch
        }
        try {
            const response = await fetch(`https://api-dev.scrapbees.com/logistics/dropoffs/${dropoffId}/materials`, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlIjoib3BlcmF0aW9ucyIsImVtYWlsIjoiamF2YWQuYXJqbWFuZGlAc2NyYXBiZWVzLmNvbSIsImlhdCI6MTcwNDk3MDM5MywiZXhwIjoxNzA1OTc4MzkzfQ.KrCootNZeLZdQK1tRWD01by2b67XU1oZUUYuL8x7nmg'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setDropoffMaterialsData(result.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchDropoffMaterials();
}, [dropoffId]);
const [keepDropdownOpen, setKeepDropdownOpen] = useState(false);

   
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDropoffs, setFilteredDropoffs] = useState(dropoffData);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [materialDropdownVisibility, setMaterialDropdownVisibility] = useState(() => initialLineItems().map(() => false));
    const [lineItems, setLineItems] = useState(initialLineItems());
    const [error, setError] = useState('');
    const [issuedAt, setIssuedAt] = useState(new Date());
    const [documentNumber, setDocumentNumber] = useState('');
    const [filteredMaterials, setFilteredMaterials] = useState([]);
    const frequentDropoffs = ["Giesen Wekos", "Diestelmann Luther GmbH & Co.KG", "TSR Düsseldorf", "Mösta", "Motikat GmbH", "ProMetall", "Wilhelm Bötzel GmbH & Co. KG", "Jungheim Schrott & Metallhandels GmbH", "Ossenbühl Schrotthandelsgesellschaft mbH"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
   
    const handleMonthSelect = (monthIndex) => {
        const newDate = new Date(issuedAt.getFullYear(), monthIndex, 1);
        setIssuedAt(newDate);
    };
    
    const handleRemoveLineItem = (index) => {
        const newLineItems = lineItems.filter((_, i) => i !== index);
        setLineItems(newLineItems);
    };
const [frequentOptions, setFrequentOptions] = useState(frequentDropoffs);

const handleSearchChange = (e) => {
    let term = e.target.value;
    setSearchTerm(term);
    setKeepDropdownOpen(false);
    if (term) {
        setDropdownVisible(true);
        const filtered = dropoffData.filter(dropoff => 
            dropoff.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredDropoffs(filtered);
    } else {
        setDropdownVisible(false);
    }
};
  
  
  const handleDropoffSelect = (dropoffName, dropoffId = null) => {
    setSearchTerm(dropoffName);
    setDropoffId(dropoffId);
    setDropdownVisible(false);

    // Find the actual dropoffId if only name is provided
    if (!dropoffId) {
        const foundDropoff = dropoffData.find(dropoff => dropoff.name === dropoffName);
        dropoffId = foundDropoff ? foundDropoff.id : null;
    }

    // Filter materials based on dropoffId
    const relatedMaterials = dropoffMaterials.filter(material => 
        material.dropoff_id.toString() === dropoffId
    );
    setFilteredMaterials(relatedMaterials);
};


  

const handleMaterialSearchChange = (value, dropoffId, index) => {
    const newLineItems = [...lineItems];
    setKeepDropdownOpen(false);
    newLineItems[index].materialDisplayName = value;
    
    const matchingMaterial = dropoffMaterialsData.find(material => 
      material.name.toLowerCase() === value.toLowerCase()
    );
  
    newLineItems[index].mappedMaterialId = matchingMaterial ? matchingMaterial.id : null;
    setLineItems(newLineItems);
  
    if (value) {
      const filtered = dropoffMaterialsData.filter(material => 
          material.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials([]);
    }
  };
  


const handleMaterialSelect = (index, name, mappedMaterialId) => {
  const newLineItems = [...lineItems];
  newLineItems[index].materialDisplayName = name; // Update display name
  newLineItems[index].mappedMaterialId = mappedMaterialId; // Update mapped material ID
  setLineItems(newLineItems);
  const newMaterialDropdownVisibility = [...materialDropdownVisibility];
  newMaterialDropdownVisibility[index] = false;
  setMaterialDropdownVisibility(newMaterialDropdownVisibility);
};




const handleAddLineItem = () => {
    setLineItems([...lineItems, { materialClassId: '', mappedMaterialId: '', weight: '', pricePerTon: '', totalSum: '' }]);
};



const validateAndSubmit = async () => {
    const isAnyLineItemFilled = lineItems.some(item => item.mappedMaterialId || item.weight || item.pricePerTon || item.totalSum);
    if (!dropoffId || !issuedAt || !documentNumber || !isAnyLineItemFilled) {
        setError('Some fields are empty');
        return;
    }

    const formattedIssuedAt = issuedAt.toISOString().split('T')[0];
    // Filter out line items where all properties are empty or null
const filledLineItems = lineItems.filter(item => 
    item.mappedMaterialId || item.weight || item.pricePerTon || item.totalSum
);
for (const item of filledLineItems) {
    const calculatedTotal = (parseFloat(item.weight) || 0) * (parseFloat(item.pricePerTon) || 0);
    if (calculatedTotal !== parseFloat(item.totalSum)) {
        alert(`Discrepancy in totals for material ID ${item.mappedMaterialId}: Entered Sum = ${item.totalSum}, Calculated Sum = ${calculatedTotal}`);
        return; // Stop the submission if there's a discrepancy
    }
}

const newLineItems = filledLineItems.map(item => ({
    dropoffMaterialId: parseInt(item.mappedMaterialId) || null,
    weight: parseFloat(item.weight) || 0,
    pricePerTon: parseInt(item.pricePerTon) || 0,
    total: (parseFloat(item.weight) || 0) * (parseInt(item.pricePerTon) || 0)
}));

const data = {
    issuedAt: formattedIssuedAt,
    lineItems: newLineItems
};

    console.log(data)
    try {
        const response = await fetch(`https://api-dev.scrapbees.com/logistics/dropoffs/${dropoffId}/documents/creditnotes`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlIjoib3BlcmF0aW9ucyIsImVtYWlsIjoiamF2YWQuYXJqbWFuZGlAc2NyYXBiZWVzLmNvbSIsImlhdCI6MTcwNDk3MDM5MywiZXhwIjoxNzA1OTc4MzkzfQ.KrCootNZeLZdQK1tRWD01by2b67XU1oZUUYuL8x7nmg',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Success:', result);
        // Handle the success response, such as updating the UI or notifying the user

    } catch (error) {
        console.error('Error:', error);
        // Handle the error, such as displaying an error message to the user
    }
    // Reset states
    setDropoffId('');
    setSearchTerm('');
    setIssuedAt(new Date());
    setDocumentNumber('');
    setLineItems(initialLineItems());
    setMaterialDropdownVisibility(initialLineItems().map(() => false));
    setError('');
};

    const getBorderStyle = (value) => {
        return value ? '1px solid #ccc' : '1px solid red';
    };
    const handleMaterialButtonClick = (selectedMaterial) => {
        let foundEmpty = false;
        let updatedLineItems = lineItems.map(item => {
            if (!foundEmpty && !item.materialClassId) {
                foundEmpty = true;
                return { ...item, materialClassId: selectedMaterial.name, mappedMaterialId: selectedMaterial.id };
            }
            return item;
        });
    
        if (!foundEmpty) {
            updatedLineItems = [...updatedLineItems, { materialClassId: selectedMaterial.name, mappedMaterialId: selectedMaterial.id, weight: '', pricePerTon: '', totalSum: '' }];
        }
    
        setLineItems(updatedLineItems);
    };
    
  

    return (
        <div>
        
        <div className="logo-container">
    <a href="https://schrottbienen.de/" target="_blank" rel="noopener noreferrer">
        <img src={logo} alt="Company Logo" />
    </a>
</div>

        <div className="wn-container">
        <div className='DropoffsL'> Dropoffs:</div>
            {error && <div className="error-message">{error}</div>}
            <div id='frequent-dropoffs'>
                {frequentOptions.map((option, index) => (
                    <button className='button-13' key={index} onClick={() => {
                        const foundDropoff = dropoffData.find(dropoff => dropoff.name === option);
                        handleDropoffSelect(option, foundDropoff ? foundDropoff.id : null);
                    }}>
                        {option}
                    </button>
                ))}
            </div>

            <input
            id='dropclass'
            type="text"
            placeholder="Search Dropoff"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setDropdownVisible(true)}
            onBlur={() => {
                setTimeout(() => {
                    if (!keepDropdownOpen) {
                        setDropdownVisible(false);
                    }
                }, 100);
            }}
        />


{dropdownVisible && searchTerm && (
 <select id='drop1items'
 onFocus={() => setKeepDropdownOpen(true)}
 onChange={(e) => {
    const selectedId = e.target.value;
    const selectedDropoff = dropoffData.find(dropoff => String(dropoff.id) === selectedId);

    if (selectedDropoff) {
        handleDropoffSelect(selectedDropoff.name, selectedId);
    } else {
        console.log('Selected ID not found in dropoff data:', selectedId);
        console.log('Dropoff Data:', dropoffData);
    }
}}
 size="5"
 onBlur={() => setKeepDropdownOpen(false)}
>
 {filteredDropoffs.map(dropoff => (
     <option id='drop1item' key={dropoff.id} value={dropoff.id}>{dropoff.name} - {dropoff.city}</option>
 ))}
</select>

)}
<div className='DropoffsL'> Date:</div>
<div className="month-selector">
    {months.map((month, index) => (
        <button className='button-13' key={index} onClick={() => handleMonthSelect(index)}>
            {month}
        </button>
    ))}
</div>

<DatePicker className='dodi' selected={issuedAt} onChange={setIssuedAt} style={{ border: getBorderStyle(issuedAt) }} />
<div className='DropoffsL'> Weight Note Number:</div>
<div>
<input id='wnumberj'
    type="text" 
    placeholder="Document Number" 
    value={documentNumber} 
    onChange={(e) => setDocumentNumber(e.target.value)} // Corrected onChange handler
   
/>
</div>
<div className='DropoffsL'> Collected Metals:</div>
{dropoffId && (
        <div className="material-class-buttons">
            {dropoffMaterialsData.map((material, index) => (
                <button className='button-13' key={index} onClick={() => handleMaterialButtonClick(material)}>
                    {material.name}
                 
                </button>
            ))}
        </div>
    )}
{lineItems.map((item, index) => (
  
    <div key={index} className="line-item">
     
     
   <input
    type="text"
    placeholder="Material Class ID"
    value={item.materialClassId}
    onChange={(e) => {
        // Update only materialDisplayName on user input
        const newLineItems = [...lineItems];
        newLineItems[index].materialDisplayName = e.target.value;
        setLineItems(newLineItems);
    }}
    onFocus={() => {
        const updatedVisibility = materialDropdownVisibility.map((v, i) => i === index);
        setMaterialDropdownVisibility(updatedVisibility);
    }}
    onBlur={() => {
       
        setTimeout(() => {
            if (!keepDropdownOpen) {
                const updatedVisibility = materialDropdownVisibility.map((v, i) => false);
                setMaterialDropdownVisibility(updatedVisibility);
            }
        }, 100);
    }}
/>



                    <input type="number" placeholder="Weight (kg)" value={item.weight} onChange={(e) => {
                        const newLineItems = [...lineItems];
                        newLineItems[index].weight = e.target.value;
                        setLineItems(newLineItems);
                    }} />
                    <input type="number" placeholder="Price per ton" value={item.pricePerTon} onChange={(e) => {
                        const newLineItems = [...lineItems];
                        newLineItems[index].pricePerTon = e.target.value;
                        setLineItems(newLineItems);
                    }} />
                    <input type="number" placeholder="Total Sum" value={item.totalSum} onChange={(e) => {
                        const newLineItems = [...lineItems];
                        newLineItems[index].totalSum = e.target.value;
                        setLineItems(newLineItems);
                    }} />
                      <button onClick={() => handleRemoveLineItem(index)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
    <img src={trash} alt="Remove" style={{ width: '20px', height: '20px' }}/>
</button>

                </div>
            ))}
           <div className='subandadd'>
            <button onClick={handleAddLineItem} className='Add'>Add Line Item</button>
            <button onClick={validateAndSubmit} id='Submit'>Submit</button>
            </div>
        </div>
        </div>
    );
};

export default Wn;