import React, { useState } from 'react';
import './BookingForm.css';

export default function BookingForm({ onSubmit, totalAmount, onBack }) {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (formattedValue.length > 5) return;
    }

    // Limit CVV to 3-4 digits
    if (name === 'cvv') {
      if (value.length > 4) return;
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress({
      ...billingAddress,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate card details
    if (!cardDetails.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = 'Please enter the name on card';
    }

    if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }

    if (!cardDetails.cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Validate billing address
    if (!billingAddress.address.trim()) {
      newErrors.address = 'Please enter your address';
    }

    if (!billingAddress.city.trim()) {
      newErrors.city = 'Please enter your city';
    }

    if (!billingAddress.state.trim()) {
      newErrors.state = 'Please enter your state';
    }

    if (!billingAddress.zipCode.trim()) {
      newErrors.zipCode = 'Please enter your zip code';
    }

    if (!billingAddress.country.trim()) {
      newErrors.country = 'Please enter your country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      onSubmit({
        paymentMethod,
        cardDetails: {
          lastFour: cardDetails.cardNumber.slice(-4),
          cardName: cardDetails.cardName
        },
        billingAddress,
        sameAsBilling
      });
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="booking-form-container">
      <h2>Payment Details</h2>
      
      <div className="payment-methods">
        <div 
          className={`payment-method ${paymentMethod === 'credit_card' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('credit_card')}
        >
          <input 
            type="radio" 
            name="paymentMethod" 
            checked={paymentMethod === 'credit_card'}
            onChange={() => {}}
          />
          <span>💳 Credit / Debit Card</span>
        </div>
        
        <div 
          className={`payment-method ${paymentMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <input 
            type="radio" 
            name="paymentMethod" 
            checked={paymentMethod === 'paypal'}
            onChange={() => {}}
          />
          <span>🅿️ PayPal</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        {paymentMethod === 'credit_card' && (
          <div className="card-details">
            <h3>Card Information</h3>
            
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={errors.cardNumber ? 'error' : ''}
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>

            <div className="form-group">
              <label>Name on Card</label>
              <input
                type="text"
                name="cardName"
                value={cardDetails.cardName}
                onChange={handleCardChange}
                placeholder="John Doe"
                className={errors.cardName ? 'error' : ''}
              />
              {errors.cardName && <span className="error-message">{errors.cardName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              </div>

              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  placeholder="123"
                  maxLength="4"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'paypal' && (
          <div className="paypal-info">
            <p>You will be redirected to PayPal to complete your payment.</p>
          </div>
        )}

        <div className="billing-section">
          <h3>Billing Address</h3>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              value={billingAddress.address}
              onChange={handleAddressChange}
              placeholder="123 Main St"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={billingAddress.city}
                onChange={handleAddressChange}
                placeholder="New York"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={billingAddress.state}
                onChange={handleAddressChange}
                placeholder="NY"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={billingAddress.zipCode}
                onChange={handleAddressChange}
                placeholder="10001"
                className={errors.zipCode ? 'error' : ''}
              />
              {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={billingAddress.country}
                onChange={handleAddressChange}
                placeholder="United States"
                className={errors.country ? 'error' : ''}
              />
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="sameAsBilling"
              checked={sameAsBilling}
              onChange={(e) => setSameAsBilling(e.target.checked)}
            />
            <label htmlFor="sameAsBilling">Shipping address is the same as billing</label>
          </div>
        </div>

        <div className="total-amount">
          <span>Total Amount:</span>
          <span className="amount">${totalAmount.toFixed(2)}</span>
        </div>

        <div className="form-actions">
          <button type="button" className="back-btn" onClick={onBack}>
            Back
          </button>
          <button 
            type="submit" 
            className="pay-btn"
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </div>

        <p className="secure-payment">
          🔒 Secure payment. Your information is encrypted.
        </p>
      </form>
    </div>
  );
}