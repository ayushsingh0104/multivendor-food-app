import React, { useEffect, useState } from 'react';
import './PlaceOrder.css';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const createOrderItems = () => {
    return food_list
      .filter(item => cartItems[item._id] > 0)
      .map(item => ({
        ...item,
        quantity: cartItems[item._id]
      }));
  };

  const handlePayment = async (paymentMethod) => {
    const orderItems = createOrderItems();

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      paymentMethod
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token }
      });

      if (response.data.success) {
        if (paymentMethod === 'Online') {
          window.location.replace(response.data.session_url);
        } else {
          navigate("/verify?success=true");
        }
      } else {
        alert("Error placing order.");
      }
    } catch (err) {
      console.error(err);
      alert("Order failed.");
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setShowPaymentOptions(true);
  };

  useEffect(() => {
    // Uncomment these checks as needed
    // if (!token || getTotalCartAmount() === 0) {
    //   navigate('/cart');
    // }
  }, [token]);

  return (
    <form onSubmit={handleProceedToPayment} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input className="emaill" required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input className="streett" required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input className="phonee" required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          {!showPaymentOptions ? (
            <button type="submit">PROCEED TO PAYMENT</button>
          ) : (
            <div className="payment-options">
              <h4>Select Payment Method:</h4>
              <button
                type="button"
                onClick={() => handlePayment('Online')}
                className="payment-button stripe"
              >
                Pay with Stripe
              </button>
              <button
                type="button"
                onClick={() => handlePayment('COD')}
                className="payment-button cod"
              >
                Cash on Delivery
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
