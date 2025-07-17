import React from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Users, TrendingUp } from 'lucide-react';

const Dashboard = ({ transactions, onUpdateStatus }) => {
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <div>
      <h2>Payment Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={48} style={{ color: '#667eea', marginBottom: '10px' }} />
          <h3>{stats.total}</h3>
          <p>Total Transactions</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: '#10B981', marginBottom: '10px' }} />
          <h3>{stats.completed}</h3>
          <p>Completed</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <Clock size={48} style={{ color: '#F59E0B', marginBottom: '10px' }} />
          <h3>{stats.pending}</h3>
          <p>Pending</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <DollarSign size={48} style={{ color: '#10B981', marginBottom: '10px' }} />
          <h3>${stats.totalAmount.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      <div className="card">
        <h3>Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.recipientName}</td>
                  <td>{transaction.amount} {transaction.currency}</td>
                  <td>{transaction.description}</td>
                  <td>
                    <span className={`status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={transaction.status}
                      onChange={(e) => onUpdateStatus(transaction.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;