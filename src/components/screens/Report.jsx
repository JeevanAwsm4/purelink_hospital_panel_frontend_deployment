import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import { BASE_URL } from '../../axiosConfig';
import './static/report.css';

export default function Report() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (userData) {
            axios.get(`${BASE_URL}/panel/report_data/`, {
                headers: {
                    Authorization: `Bearer ${userData?.access}`,
                },
            })
                .then((response) => {
                    if (response.data.status_code === 6000) {
                        setData(response.data.current_data);
                    } else {
                        setError('Failed to fetch data');
                    }
                })
                .catch((err) => {
                    setError('An error occurred while fetching data');
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [userData]);

    const handleReportCreation = (hospitalId, donorId) => {
        axios.post(`${BASE_URL}/panel/report/${hospitalId}/${donorId}/`, {}, {
            headers: {
                Authorization: `Bearer ${userData?.access}`,
            },
        })
            .then((response) => {
                console.log(response.data);
                if (response.data.status_code === 6000) {
                    // Handle success response, maybe refetch data or show a message
                } else {
                    // Handle error response, maybe show a message
                }
            })
            .catch((err) => {
                console.error('Error creating report:', err);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="bax">
            {data.map((request, requestIndex) => (
                <div className="box1" key={requestIndex}>
                    <div className='did'>
                        <h3 className="datee">Date: {new Date(request.datetime).toLocaleDateString()}</h3>
                        <h3 className="requestt">Request ID : #{request.id}</h3>
                    </div>
                    <div className="inbax">
                        {request.donor.map((donor, donorIndex) => (
                            <span className="patient" key={donorIndex}>
                                <h5>#{donor.serial_number}</h5>
                                <div className="patient_name"><h3>{donor.name}</h3></div>
                                <div className='door_sign'>
                                    <h4 className={
                                        donor.rep_score > 80 ? 'positive' : 
                                        donor.rep_score < 20 ? 'bad' : 
                                        'warning'
                                    }>
                                        {
                                            donor.rep_score > 80 ? 'Good' : 
                                            donor.rep_score < 20 ? 'Bad' : 
                                            'Warning'
                                        }
                                    </h4>
                                    <div className="indication">
                                        <div className={
                                            donor.rep_score > 80 ? 'positive' : 
                                            donor.rep_score < 20 ? 'bad' : 
                                            'warning'
                                        }></div>
                                    </div>
                                </div>
                                <div className="report">
                                    <button 
                                        className="report11" 
                                        onClick={() => handleReportCreation(request.id, donor.id)}
                                    >
                                        Create Report
                                    </button>
                                </div>
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
