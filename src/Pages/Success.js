import React from 'react';
import { useLocation } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const orderId = new URLSearchParams(location.search).get('order_id');

    return (
        <div className="success-page">
            <h2>🎉 Order Successful!</h2>
            <p>Your order ID is: <strong>{orderId}</strong></p>
        </div>
    );
};

export default Success;
