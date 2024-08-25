import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../App';
import { BASE_URL } from '../../axiosConfig';
import './static/contact.css';

export default function Contact() {
    const [currentData, setCurrentData] = useState([]);
    const [otherData, setOtherData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMoreDonors, setShowMoreDonors] = useState(false);

    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (userData) {
            axios.get(`${BASE_URL}/panel/contact/`, {
                headers: {
                    Authorization: `Bearer ${userData?.access}`,
                },
            })
                .then((response) => {
                    console.log(response);
                    if (response.data.status_code === 6000) {
                        setCurrentData(response.data.current_data);
                        setOtherData(response.data.other_data);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <section className='c-wrapper'>
                {/* Mapping current_data */}
                {currentData.map((requestData, index) => (
                    <React.Fragment key={index}>
                        <div className="new">
                            <div className="top">
                                <h4>{new Date(requestData.datetime).toLocaleDateString()}</h4>
                                <h4>Type of Donation: <span>{requestData.type_of_donation}</span></h4>
                            </div>
                            <div className="below">
                                <div className="top">
                                    <div className="left">
                                        <h1>Requested {requestData.wanted_count} donors for <span>{requestData.blood_group}.</span></h1>
                                    </div>
                                </div>
                                <div className="below">
                                    <table border='1px'>
                                        <thead>
                                            <tr>
                                                <th>Sl No.</th>
                                                <th>Full Name</th>
                                                <th>Phone No.</th>
                                                <th>Blood Group</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requestData.donor.map((donor, donorIndex) => (
                                                <tr key={donorIndex}>
                                                    <td>{donorIndex + 1}</td>
                                                    <td>{donor.name}</td>
                                                    <td>{donor.phone_no}</td>
                                                    <td>{donor.blood_group}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {!showMoreDonors && (
                                        <h1><span>View More <img src={require('./../assets/images/main/view-more.png')} alt="icon" /></span></h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}

                {/* Mapping other_data */}
                {otherData.map((requestData, index) => (
                    <React.Fragment key={index}>
                        <div className="old">
                            <div className="top">
                                <h4>{new Date(requestData.datetime).toLocaleDateString()}</h4>
                                <h4>Type of Donation: <span>{requestData.type_of_donation}</span></h4>
                            </div>
                            <div className="below">
                                <div className="left">
                                    <h1>Requested {requestData.wanted_count} donors for <span>{requestData.blood_group}.</span></h1>
                                    <h1 className='flex'><span>{requestData.donors} Donors Accepted.</span><img src={require('./../assets/images/main/red-down-arrow.png')} alt="icon" /></h1>
                                </div>
                                <div className="right">
                                    <span>Request Expired <img src={require('./../assets/images/main/expire.png')} alt="icon" /></span>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </section>
        </div>
    );
}
