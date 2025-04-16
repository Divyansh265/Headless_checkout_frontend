import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = searchParams.get("token");

    useEffect(() => {
        const fetchCartData = async () => {
            if (!token) return;

            try {
                const response = await fetch(`https://headless-checkout-backend.onrender.com/api/cart-data?token=${encodeURIComponent(token)}`);
                const data = await response.json();
                setCartData(data);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [token]);

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
        </div>
    );
};

export default Checkout;
