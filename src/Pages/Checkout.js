import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
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
        setPlacingOrder(true);
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
                setTimeout(() => {
                    navigate(`/success?order_id=${result.order.id}`);
                }, 3000);
            } else {
                setOrderStatus(`❌ Order creation failed: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderStatus("❌ Failed to place order");
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cartData) return <p>No cart found.</p>;

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <p><strong>Total:</strong> ${(cartData.total_price / 100).toFixed(2)}</p>
            <ul>
                {cartData.items.map(item => (
                    <li key={item.id} className="cart-item">
                        <img src={item.image} alt={item.title} width="60" />
                        <div>
                            <p>{item.title}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Price: ${(item.price / 100).toFixed(2)}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {!orderStatus && !placingOrder && (
                <button onClick={handlePlaceOrder} className="place-order-btn">
                    Place Order
                </button>
            )}

            {placingOrder && <p>Placing your order...</p>}
            {orderStatus && <p className="status-message">{orderStatus}</p>}
        </div>
    );
};

export default Checkout;
