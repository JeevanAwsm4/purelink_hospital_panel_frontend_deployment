import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './static/subscribe.css';
import { BASE_URL } from '../../axiosConfig';
import { UserContext } from '../../App';
import { Navigate } from 'react-router-dom';

export default function Subscribe() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [authenticatedName, setAuthenticatedName] = useState('Medicity Kollam');
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [isLoadingVerify, setIsLoadingVerify] = useState(true);

    const { userData } = useContext(UserContext);

    // Load Razorpay SDK
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            console.log('Razorpay SDK loaded successfully');
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Verify user and subscription status
    useEffect(() => {
        if (userData) {
            axios.get(`${BASE_URL}/panel/verify/`, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.status_code === 6000) {
                        setIsVerified(true);
                        setAuthenticatedName(res.data.name);
                        console.log("setiSVerify teuw done")
                        setHasSubscription(res.data.subscription_active);
                    } else {
                        setIsVerified(false);
                    }
                })
                .catch((err) => {
                    console.error('Verification failed:', err);
                })
                .finally(() => {
                    setIsLoadingVerify(false);
                });
        } else {
            setIsLoadingVerify(false);
        }
    }, [userData]);

    // Fetch subscriptions
    useEffect(() => {
        if (userData?.access && isVerified) {
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
    }, [userData, isVerified]);

    const handleSubscribe = (planId) => {
        if (userData?.access) {
            axios.post(`${BASE_URL}/panel/create_subscription/`, { plan_id: planId }, {
                headers: {
                    Authorization: `Bearer ${userData.access}`,
                },
            })
            .then((response) => {
                if (response.data.status_code === 6000) {
                    const { id } = response.data.payment;
                    const options = {
                        key: 'rzp_live_OW5GGmjI5rXFR7',
                        amount: response.data.payment.amount,
                        currency: 'INR',
                        name: 'Purelink.in',
                        description: 'Subscription Payment',
                        order_id: id,
                        handler: function (response) {
                            axios.post(`${BASE_URL}/panel/payment_success/`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan_id: planId, 
                            }, {
                                headers: {
                                    Authorization: `Bearer ${userData.access}`,
                                },
                            })
                            .then((res) => {
                                if (res.data.status_code === 6000) {
                                    alert('Subscription Renewed!');
                                } else {
                                    alert('Payment Failed!');
                                }
                            })
                            .catch((error) => {
                                console.error('Error processing payment:', error);
                            });
                        },
                        prefill: {
                            name: 'Your name',
                            email: 'your-email@example.com',
                            contact: '9999999999',
                        },
                        theme: {
                            color: '#3399cc',
                        },
                    };
                    const paymentObject = new window.Razorpay(options);
                    paymentObject.open();
                } else {
                    console.error('Error creating subscription:', response.data.message);
                }
            })
            .catch((error) => {
                console.error('Error creating subscription:', error);
            });
        }
    };

    if (isLoadingVerify) {
        return <div>Loading verification...</div>;
    }
    if (hasSubscription) {
        return <Navigate to="/panel/dashboard" />;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div id='s-false'>
            <div className="wrapper">
                <div className="s-false-top">
                    <h1 className='subscribed-false-top'>
                        <span className='s-false'>Uh Oh! </span>Looks like you're out of fuel⛽.<span className='s-false'>Resubscribe here.</span>
                    </h1>
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
                                <button className='s-subscribe-button' style={{ border: `1px solid ${subscription.color}`, color: `${subscription.color}` }} onClick={() => handleSubscribe(subscription.id)}>
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='s-authenticated-as'>
                    <h1>Signed in as <span>{authenticatedName}</span></h1>
                </div>
            </div>
        </div>
    );
}
