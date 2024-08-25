import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './static/subscription.css';
import { BASE_URL } from '../../axiosConfig';
import { UserContext } from '../../App';

export default function Subscription() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (userData?.access) {
            axios.get(`${BASE_URL}/panel/subscriptions/`, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            })
            .then((response) => {
                if (response.data.status_code === 6000) {
                    setSubscriptions(response.data.data);
                } else {
                    console.error('Error fetching subscriptions:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching subscriptions:', error);
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [userData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div id='subscription'>
                <div className="info">
                    <h3> 🟣 Subscription started on <span>27/03/2024 (Monthly)</span></h3>
                    <h3> 🟣 Your subscription ends on <span>27/04/2024</span></h3>
                </div>
                <div className='s-options'>
                    {subscriptions.map((subscription) => (
                        <div key={subscription.id} className='subscription' style={{ border: `1px solid ${subscription.color}` }}>
                            <div className='s-banner'>
                                <img src={require('./../assets/images/main/real.jpg')} alt='banner' />
                            </div>
                            <div className='subscription-wrapper'>
                                <h2 className='s-title' style={{ color: `${subscription.color}` }}>{subscription.type} Subscription</h2>
                                <p className='s-price' style={{ color: `${subscription.color}` }}>{subscription.price}$/month</p>
                                <ul className='s-features-list'>
                                    {subscription.features.map((feature, index) => (
                                        <li key={index}>
                                            <div className='s-circle' style={{ backgroundColor: `${subscription.color}` }}></div>
                                            <span style={{ color: `${subscription.color}` }}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
