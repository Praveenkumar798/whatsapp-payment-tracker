import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PaymentGenerator from './components/PaymentGenerator';
import QRCodeDisplay from './components/QRCodeDisplay';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import Login from './components/Login';

const WEBHOOK_URL = 'https://eowqqlm4n5awpjc.m.pipedream.net';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }

    // Load transactions from localStorage
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Send to webhook if URL is provided
    if (WEBHOOK_URL) {
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTransaction),
      }).catch(console.error);
    }
  };

  const updateTransactionStatus = (id, status) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, status } : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="App">
      <header className="header">
        <div className="container">
          <h1>WhatsApp Payment Tracker</h1>
          <nav className="nav">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Payment Generator
            </Link>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>
              Transaction History
            </Link>
            <button 
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
              }}
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<PaymentGenerator onAddTransaction={addTransaction} />} />
          <Route path="/qr/:id" element={<QRCodeDisplay transactions={transactions} />} />
          <Route path="/dashboard" element={<Dashboard transactions={transactions} onUpdateStatus={updateTransactionStatus} />} />
          <Route path="/history" element={<TransactionHistory transactions={transactions} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;