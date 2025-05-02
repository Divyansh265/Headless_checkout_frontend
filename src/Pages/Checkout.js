import React, { use, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Checkout.css";
import ContactDeliveryForm from "./ContactDeliveryForm";

const Checkout = () => {
    const [cartData, setCartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState(null);
    const [discountCode, setDiscountCode] = useState("");
    const [discountStatus, setDiscountStatus] = useState(null);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountType, setDiscountType] = useState(null);
    const [actualDiscount, setActualDiscount] = useState(0);
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    // const token = "Z2NwLXVzLWVhc3QxOjAxSlQ1UjBFQ1kxMVFEUDRENTI1MzZCQzc2?key=360750642513b2d782ad356ac22792f7";

    useEffect(() => {
        if (token) {
            const fetchCartData = async () => {
                try {
                    const response = await fetch(
                        `https://headless-checkout-backend.onrender.com/api/cart-data?token=${token}`
                    );
                    const data = await response.json();
                    console.log("Data", data);
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
            const result = await response.json();
            console.log("Discount price rule :", result.priceRule);

            if (response.ok) {
                setDiscountStatus(`Discount applied: ${result.priceRule.title}`);
                setDiscountType(result.priceRule.value_type);
                if (result.priceRule.value_type === "fixed_amount") {
                    setDiscountValue(Math.abs(parseFloat(result.priceRule.value)) * 100);
                    setActualDiscount(Math.abs(parseFloat(result.priceRule.value)) * 100);

                } else if (result.priceRule.value_type === "percentage") {
                    const discount = ((cartData.total_price * (Math.abs(parseFloat(result.priceRule.value)) / 100)) / 100).toFixed(2);
                    const actDis = (Math.abs(parseFloat(result.priceRule.value))).toFixed(2)
                    setActualDiscount(actDis)
                    console.log("Discount value ", actDis)
                    console.log("Discount value state ", discount)
                    setDiscountValue(discount);
                }
            } else {
                setDiscountStatus(`Failed: ${result.error}`);
                setDiscountValue(0);
            }
        } catch (error) {
            console.error("Error applying discount:", error);
            setDiscountStatus("Error applying discount");
            setDiscountValue(0);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            // Send cart items + discount info; let backend calculate total
            const orderPayload = {
                items: cartData.items,
                currency: cartData.currency,
                discount: {
                    code: discountCode,
                    value: actualDiscount,
                    type: discountType,
                },
            };

            const response = await fetch(
                "https://headless-checkout-backend.onrender.com/api/create-order",
                // "http://localhost:3800/api/create-order",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderPayload),
                }
            );

            const result = await response.json();

            if (response.ok) {
                setOrderStatus(`Order created! ID: ${result.order.id}`);
            } else {
                setOrderStatus(` Order creation failed: ${result.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setOrderStatus(" Failed to place order");
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cartData) return <p>No cart found.</p>;

    const discountedTotal = cartData.total_price - (discountValue);

    return (
        <div className="checkout-page">
            <div className="checkout-address-form">
                <ContactDeliveryForm />
            </div>

            <div className="checkout--products-container">
                <h2>Checkout</h2>

                <ul>
                    {cartData.items.map((item) => (
                        <li key={item.id} className="cart-item">
                            <img
                                className="cart-product-img"
                                src={item.image}
                                alt={item.title}
                            />

                            <div className="cart-product-data">
                                <div>
                                    <p className="cart-product-item-name">{item.product_title}</p>
                                    <p className="cart-product-item-quantity">
                                        Qty: {item.quantity}
                                    </p>
                                    <p className="cart-product-variant">{item.variant_title}</p>
                                </div>
                                <div>
                                    <p className="cart-product-item-price"> {cartData.currency} {(item.price / 100).toFixed(2)} </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

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

                <div className="checkout-summary">
                    <div className="checkout-item-count">
                        <p>Subtotal ({cartData.item_count} items):</p>
                        <p>{cartData.currency} {(cartData.total_price / 100).toFixed(2)}</p>
                    </div>

                    {discountValue > 0 && (
                        <div className="discount-summary">
                            <p>Discount:</p>
                            <p>- {cartData.currency} {(discountValue).toFixed(2)}</p>
                        </div>
                    )}

                    <div className="total">
                        <p>Total:</p>
                        <p>
                            {cartData.currency} {(discountedTotal).toFixed(2)}
                        </p>
                    </div>
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
