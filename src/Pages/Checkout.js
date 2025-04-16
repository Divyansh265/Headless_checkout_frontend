import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState(null);
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (token) {
            const fetchCartData = async () => {
                try {
                    const response = await fetch(`https://headless-checkout-backend.onrender.com/api/cart-data?token=${token}`);
                    const data = await response.json();
                    setCartData(data);
                } catch (error) {
                    console.error("Error fetching cart data:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchCartData();
        }
    }, [token]);

    const handlePlaceOrder = async () => {
        try {
            const response = await fetch('https://headless-checkout-backend.onrender.com/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartData),
            });

            const result = await response.json();
            if (response.ok) {
                setOrderStatus(`✅ Order created! ID: ${result.order.id}`);
            } else {
                setOrderStatus(`❌ Order creation failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderStatus("❌ Failed to place order");
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cartData) return <p>No cart found.</p>;

    return (
        <div>
            <h2>Checkout</h2>
            <p><strong>Total:</strong> ${(cartData.total_price / 100).toFixed(2)}</p>
            <ul>
                {cartData.items.map(item => (
                    <li key={item.id}>
                        <img src={item.image} alt={item.title} width="50" />
                        <p>{item.title}</p>
                        <p>Qty: {item.quantity}</p>
                        <p>Price: ${(item.price / 100).toFixed(2)}</p>
                    </li>
                ))}
            </ul>
            <button onClick={handlePlaceOrder} style={{ padding: '10px 20px', marginTop: '20px' }}>
                Place Order
            </button>
            {orderStatus && <p style={{ marginTop: '10px' }}>{orderStatus}</p>}
        </div>
    );
};

export default Checkout;
