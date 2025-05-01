import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState(null);
    const [discountCode, setDiscountCode] = useState("");
    const [discountStatus, setDiscountStatus] = useState(null);
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (token) {
            const fetchCartData = async () => {
                try {
                    const response = await fetch(
                        `https://headless-checkout-backend.onrender.com/api/cart-data?token=${token}`
                    );
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


    const handleApplyDiscount = async () => {
        try {
            const response = await fetch("https://headless-checkout-backend.onrender.com/api/apply-discount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: discountCode }),
            });
            console.log("Discount price rule :", response.json())
            const result = await response.json();
            if (response.ok) {
                setDiscountStatus(`Discount applied: ${result.discountAmount}`);
            } else {
                setDiscountStatus(`Failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Error applying discount:", error);
            setDiscountStatus("Error applying discount");
        }
    };


    const handlePlaceOrder = async () => {
        try {
            const response = await fetch(
                "https://headless-checkout-backend.onrender.com/api/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cartData),
                }
            );

            const result = await response.json();
            if (response.ok) {
                setOrderStatus(`Order created! ID: ${result.order.id}`);
            } else {
                setOrderStatus(
                    `Order creation failed: ${result.error || "Unknown error"}`
                );
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderStatus("Failed to place order");
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cartData) return <p>No cart found.</p>;

    return (
        <div className="checkout-page">
            <div className="checkout-address-form"> form </div>

            <div className="checkout--products-container">
                <h2>Checkout</h2>

                <ul>
                    {cartData.items.map((item) => (
                        <li key={item.id} className="cart-item">

                            <img
                                className="cart-product-img"
                                src={item.image}
                                alt={item.title}
                                width="60"
                            />

                            <div className="cart-product-data">
                                <p className="cart-product-item-name">{item.title}</p>
                                <p className="cart-product-item-quantity"> Qty: {item.quantity}</p>
                                <p className="cart-product-item-price">
                                    Price: ${(item.price / 100).toFixed(2)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                <p>
                    <strong>Total:</strong> ${(cartData.total_price / 100).toFixed(2)}
                </p>

                <div className="discount-codes">
                    <input
                        className="discount-feild"
                        type="text"
                        placeholder="Discount code or gift card"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button onClick={handleApplyDiscount} className="discount-apply-btn">
                        Apply
                    </button>
                    {discountStatus && <p>{discountStatus}</p>}
                </div>

                {!orderStatus && (
                    <button onClick={handlePlaceOrder} className="place-order-btn">
                        Place Order
                    </button>
                )}
                {orderStatus && <p className="status-message">{orderStatus}</p>}
            </div>
        </div>
    );
};

export default Checkout;
