import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../App';
import axios from 'axios';
import { BASE_URL } from '../../axiosConfig';
import { Navigate } from 'react-router-dom';

export default function PrivateRoutes({ element: Element, ...rest }) {
    const [isVerified, setIsVerified] = useState(false);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { userData } = useContext(UserContext);

    useEffect(() => {
        if (userData) {
            axios.get(`${BASE_URL}/panel/verify/`, {
                headers: {
                    Authorization: `Bearer ${userData?.access}`,
                },
            })
                .then((res) => {
                    if (res.data.status_code === 6000) {
                        setIsVerified(true);
                        setHasSubscription(res.data.subscription_active);
                    } else {
                        setIsVerified(false);
                    }
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [userData]);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!isVerified) {
        return <Navigate to="/panel" />;
    }

    return hasSubscription ? <Element {...rest} /> : <Navigate to="/subscribe" />;
}

// Placeholder loading indicator component
function LoadingIndicator() {
    return <div>Loading...</div>;
}
