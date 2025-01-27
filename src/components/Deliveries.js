import React, { useState, useEffect } from 'react';
import '../styles/Deliveries.scss';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    amount: '',
    tip: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    const savedDeliveries = localStorage.getItem('deliveries');
    if (savedDeliveries) {
      setDeliveries(JSON.parse(savedDeliveries));
    }
  }, []);

  const saveToLocalStorage = (updatedDeliveries) => {
    localStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDelivery = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      amount: parseFloat(formData.amount) || 0,
      tip: parseFloat(formData.tip) || 0
    };

    const updatedDeliveries = [...deliveries, newDelivery];
    setDeliveries(updatedDeliveries);
    saveToLocalStorage(updatedDeliveries);

    // Reset form
    setFormData({
      address: '',
      phone: '',
      amount: '',
      tip: '',
      paymentMethod: 'cash'
    });
  };

  const handleAmountCorrection = (id, newAmount) => {
    const updatedDeliveries = deliveries.map(delivery => {
      if (delivery.id === id) {
        return {
          ...delivery,
          amount: parseFloat(newAmount) || delivery.amount
        };
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    saveToLocalStorage(updatedDeliveries);
  };

  return (
    <div className="deliveries">
      <h1>Deliveries</h1>
      
      <form className="deliveries-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label>Tip</label>
            <input
              type="number"
              name="tip"
              value={formData.tip}
              onChange={handleInputChange}
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Delivery</button>
      </form>

      <div className="deliveries-list">
        {deliveries.map(delivery => (
          <div key={delivery.id} className="delivery-item">
            <div className="delivery-header">
              <h3>Delivery #{delivery.id}</h3>
              <span className="timestamp">
                {new Date(delivery.timestamp).toLocaleString()}
              </span>
            </div>
            
            <div className="delivery-details">
              <div className="detail-item">
                <div className="label">Address:</div>
                <div className="value">{delivery.address}</div>
              </div>
              <div className="detail-item">
                <div className="label">Phone:</div>
                <div className="value">{delivery.phone}</div>
              </div>
              <div className="detail-item">
                <div className="label">Payment Method:</div>
                <div className="value">{delivery.paymentMethod}</div>
              </div>
              <div className="detail-item">
                <div className="label">Tip:</div>
                <div className="value">${delivery.tip.toFixed(2)}</div>
              </div>
            </div>

            <div className="amount-edit">
              <input
                type="number"
                step="0.01"
                defaultValue={delivery.amount}
                onBlur={(e) => handleAmountCorrection(delivery.id, e.target.value)}
              />
              <span>Current Amount: ${delivery.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deliveries;
