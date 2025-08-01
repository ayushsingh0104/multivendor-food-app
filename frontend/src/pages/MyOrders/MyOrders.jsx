import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2 className='myordersp'>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="parcel" />
            
            <p>
              <b>Items:</b> {order.items.map((item, i) => (
                <span key={i}>
                  {item.name} x {item.quantity}{i < order.items.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>

            <p><b>Total:</b> ${order.amount}.00</p>
            <p><b>Quantity:</b> {order.items.length}</p>
            <p><b>Status:</b> <span>&#x25cf;</span> <b>{order.status}</b></p>
            <p><b>Payment Method:</b> {order.paymentMethod || 'N/A'}</p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
