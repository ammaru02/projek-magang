import React, { useState, useEffect, useRef } from 'react';
import './KeunggulanComp.css';

const KeunggulanComp = () => {
    const [keunggulan, setKeunggulan] = useState([]);
    const [expandedIndexes, setExpandedIndexes] = useState([]);
    const descriptionRefs = useRef([]);

    useEffect(() => {
        fetch('http://localhost:5000/keunggulan')
            .then(response => response.json())
            .then(data => {
                console.log(data); // print the response to console
                if (Array.isArray(data.data)) {
                    setKeunggulan(data.data);
                } else {
                    console.error('Data is not an array');
                }
            })
            .catch(error => console.error('Error fetching keunggulan:', error));
    }, []);

    const toggleExpand = (index) => {
        if (expandedIndexes.includes(index)) {
            setExpandedIndexes(expandedIndexes.filter(i => i !== index));
        } else {
            setExpandedIndexes([...expandedIndexes, index]);
        }
    };

    return (
        <div className="container-sm">
            <div className="page-keunggulan">
                <i className="fa-solid fa-house"><p className="teks-icon">/ KEUNGGULAN DESA</p></i>
                <h2 className="title-keunggulan">KEUNGGULAN DESA KASSI</h2>
            </div>
            {keunggulan.map((item, index) => (
                <div className="card-keunggulan" key={index}>
                    <div className="card-content-keunggulan">
                        <div className="card-map-keunggulan">
                            <img src={item.foto} className="card-img-top" alt="..." />
                        </div>
                        <div className="card-description-keunggulan">
                            <div 
                                ref={el => descriptionRefs.current[index] = el} 
                                className={expandedIndexes.includes(index) ? '' : 'text-clamp'}
                                dangerouslySetInnerHTML={{
                                    __html: expandedIndexes.includes(index) ? item.deskripsi : `${item.deskripsi.split(' ').slice(0, 80).join(' ')}...`
                                }}
                            />
                            <button className="btn btn-primary" onClick={() => toggleExpand(index)}>
                                {expandedIndexes.includes(index) ? 'Tutup' : 'Lihat Selengkapnya'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KeunggulanComp;
