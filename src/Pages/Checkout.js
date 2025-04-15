import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function Checkout() {
    const [searchParams] = useSearchParams();
    const [cartData, setCartData] = useState(null);
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            fetch(`https://headless-checkout-backend.onrender.com/api/cart-data/${token}`)
                .then(res => res.json())
                .then(data => {
                    setCartData(data);
                })
                .catch(err => console.error('Failed to fetch cart data:', err));
        }
    }, [token]);

    if (!cartData) return <p>Loading...</p>;

    return (
        <div>
            <h2>Your Cart</h2>
            {cartData.items.map(item => (
                <div key={item.id}>
                    <img src={item.image} alt={item.title} width="100" />
                    <p>{item.title}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: {item.price / 100} {cartData.currency}</p>
                </div>
            ))}
        </div>
    );
}

export default Checkout;