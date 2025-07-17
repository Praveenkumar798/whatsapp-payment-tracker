import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Send } from 'lucide-react';

const PaymentGenerator = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    amount: '',
    currency: 'USD',
    description: '',
    phoneNumber: '',
    paymentMethod: 'whatsapp'
  });
  const [generatedLink, setGeneratedLink] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transaction = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    onAddTransaction(transaction);
    
    // Generate payment link
    const link = generatePaymentLink(transaction);
    setGeneratedLink(link);
  };

  const generatePaymentLink = (transaction) => {
    const message = `Payment Request: ${transaction.amount} ${transaction.currency} for ${transaction.description}. Please confirm payment.`;
    return `https://wa.me/${transaction.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const generateQRCode = () => {
    const qrData = {
      ...formData,
      paymentLink: generatedLink
    };
    
    const qrId = Date.now().toString();
    localStorage.setItem(`qr_${qrId}`, JSON.stringify(qrData));
    navigate(`/qr/${qrId}`);
  };

  return (
    <div className="card">
      <h2>Generate Payment Link</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient Name</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number (with country code)</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            placeholder="+1234567890"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({...formData, currency: e.target.value})}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="INR">INR</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="3"
            required
          />
        </div>

        <button type="submit" className="btn">
          <Send size={18} style={{ marginRight: '8px' }} />
          Generate Payment Link
        </button>
      </form>

      {generatedLink && (
        <div className="payment-info">
          <h3>Payment Link Generated!</h3>
          <p><strong>Link:</strong> <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a></p>
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => copyToClipboard(generatedLink)}
            >
              <Copy size={18} style={{ marginRight: '8px' }} />
              Copy Link
            </button>
            <button 
              className="btn"
              onClick={generateQRCode}
            >
              Generate QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGenerator;