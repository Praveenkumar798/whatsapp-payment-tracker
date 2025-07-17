import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { Download, Share2 } from 'lucide-react';

const QRCodeDisplay = ({ transactions }) => {
  const { id } = useParams();
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    const savedQrData = localStorage.getItem(`qr_${id}`);
    if (savedQrData) {
      setQrData(JSON.parse(savedQrData));
    }
  }, [id]);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = `payment-qr-${id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment QR Code',
          text: `Payment request for ${qrData.amount} ${qrData.currency}`,
          url: qrData.paymentLink
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrData.paymentLink);
      alert('Payment link copied to clipboard!');
    }
  };

  if (!qrData) {
    return (
      <div className="card">
        <h2>QR Code not found</h2>
        <p>The requested QR code could not be found.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Payment QR Code</h2>
      
      <div className="payment-info">
        <h3>Payment Details</h3>
        <p><strong>Recipient:</strong> {qrData.recipientName}</p>
        <p><strong>Amount:</strong> {qrData.amount} {qrData.currency}</p>
        <p><strong>Description:</strong> {qrData.description}</p>
        <p><strong>Phone:</strong> {qrData.phoneNumber}</p>
      </div>

      <div className="qr-container">
        <QRCode
          value={qrData.paymentLink}
          size={300}
          level="M"
          includeMargin={true}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button className="btn btn-secondary" onClick={downloadQR}>
          <Download size={18} style={{ marginRight: '8px' }} />
          Download QR
        </button>
        <button className="btn" onClick={shareQR}>
          <Share2 size={18} style={{ marginRight: '8px' }} />
          Share
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p><strong>WhatsApp Link:</strong></p>
        <a 
          href={qrData.paymentLink} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#25D366', textDecoration: 'none' }}
        >
          {qrData.paymentLink}
        </a>
      </div>
    </div>
  );
};

export default QRCodeDisplay;