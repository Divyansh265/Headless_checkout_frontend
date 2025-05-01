import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Checkout.css";
import ContactDeliveryForm from "./ContactDeliveryForm";

const Checkout = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [discountCode, setDiscountCode] = useState();
  const [discountStatus, setDiscountStatus] = useState(null);
  const [appliedPriceRule, setAppliedPriceRule] = useState(null);
  const [discountValue, setDiscountValue] = useState(null);
  const location = useLocation();
  const [discountTitle, setDiscountTitle] = useState(null);

  // const token = new URLSearchParams(location.search).get('token');
  const token =
    "Z2NwLXVzLWVhc3QxOjAxSlJGRDlHRDcwRzQxNUhTQTZRUk02TTU1?key=6fff473dace8ec0a9a0d52a4329176f1";

  // fetch cart data
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

  // apply discount
  const handleApplyDiscount = async () => {
    try {
      const response = await fetch(
        "https://headless-checkout-backend.onrender.com/api/apply-discount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: discountCode }),
        }
      );
      const result = await response.json();
      console.log(result)
      console.log("Discount price rule :", result.priceRule);
      setDiscountValue(result.priceRule.value);
      setDiscountTitle(result.priceRule.title);

      if (response.ok) {
        setDiscountStatus(`Discount applied: ${result.priceRule.title}`);
        
      } else {
        setDiscountStatus(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountStatus("Error applying discount");
    }
  };

  // remmove discount
  const removeDiscount = () => {
    setDiscountValue(null);
    setDiscountStatus(null);
    setDiscountCode("");
  };

  // create order
  const handlePlaceOrder = async () => {
    try {
      const response = await fetch(
        "https://headless-checkout-backend.onrender.com/create-order",
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
          ` Order creation failed: ${result.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setOrderStatus(" Failed to place order");
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (!cartData) return <p>No cart found.</p>;

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
                  <p className="cart-product-item-price">
                    {" "}
                    {cartData.currency} {(item.price / 100).toFixed(2)}{" "}
                  </p>
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

          <div className="remove-discount-sec">
            {discountStatus ? (
              <button className="remove-discount-btn" onClick={removeDiscount}>
                {/* <p>{discountStatus}</p> */}
                <p>{discountTitle}</p>
              </button>
            ) : null}
          </div>
        </div>

        <div className="checkout-item-count">
          <p>
            Subtotal: {cartData.item_count ? cartData.item_count : "No items"}{" "}
            items
          </p>
          <p>
            {cartData.currency} {(cartData.total_price / 100).toFixed(2)}
          </p>
        </div>

        <div className="total">
          <p>Total:</p>
          {/* <p>{cartData.currency} {(cartData.total_price / 100).toFixed(2)} {discountValue} </p> */}
          <p>
            {cartData.currency}{" "}
            {(
              Number(cartData.total_price) / 100 +
              (discountValue != null ? Number(discountValue) : 0)
            ).toFixed(2)}
          </p>
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
