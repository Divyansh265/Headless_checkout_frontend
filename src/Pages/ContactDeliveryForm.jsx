import React, { useState } from "react";

const ContactDeliveryForm = () => {
  const [formData, setFormData] = useState({
    newsOffers: false,
    country: "Kuwait",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    governorate: "",
    phone: "",
    saveInfo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="contact-form">
      <form onSubmit={handleSubmit}>
        <div className="email-section">
          <h2>Contact</h2>
          <div className="form-group email">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              checked={formData.newsOffers}
              onChange={handleChange}
            />
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="newsOffers"
              name="newsOffers"
              checked={formData.newsOffers}
              onChange={handleChange}
            />
            <label htmlFor="newsOffers">Email me with news and offers</label>
          </div>
        </div>

        <div className="delivery-section">
          <h3>Delivery</h3>

          <div className="form-group">
            <label htmlFor="country">Country/Region</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="Kuwait">Kuwait</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="UAE">United Arab Emirates</option>
              {/* Add more countries as needed */}
            </select>
          </div>
        </div>

        <div className="name-fields-section">
          <div className="form-group">
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Firstname"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Lastname"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="address-secion">
          <div className="form-group">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
            />
          </div>
        </div>

        <div className="address-secion-2">
          <div className="form-group">
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              placeholder="Apartment, suite, etc. (optional)"
              onChange={handleChange}
            />
          </div>
        </div>

        <div class="address-sevtion-3">
          <div className="postalCode-section">
            <div className="address-section">
              <div className="address-fields">
                <div className="form-group">
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    placeholder="Postal code (optional)"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="city-section">
              <div className="form-group">
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="phone-section">
            <div className="form-group">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

        </div>
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="saveInfo"
            name="saveInfo"
            checked={formData.saveInfo}
            onChange={handleChange}
          />
          <label htmlFor="saveInfo">Save this information for next time</label>
        </div>


      </form>
    </div>
  );
};

export default ContactDeliveryForm;
