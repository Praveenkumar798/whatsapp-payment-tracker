import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

const TransactionHistory = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(transaction => 
      statusFilter === 'all' || transaction.status === statusFilter
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'amount':
          return b.amount - a.amount;
        case 'name':
          return a.recipientName.localeCompare(b.recipientName);
        default:
          return 0;
      }
    });

  const exportTransactions = () => {
    const csvContent = [
      ['Recipient', 'Amount', 'Currency', 'Description', 'Phone', 'Status', 'Date'],
      ...filteredTransactions.map(t => [
        t.recipientName,
        t.amount,
        t.currency,
        t.description,
        t.phoneNumber,
        t.status,
        new Date(t.timestamp).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transaction-history.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Transaction History</h2>
        <button className="btn btn-secondary" onClick={exportTransactions}>
          <Download size={18} style={{ marginRight: '8px' }} />
          Export CSV
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '250px' }}>
            <label>Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status Filter</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <p style={{ marginBottom: '20px', color: '#666' }}>
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </p>

        {filteredTransactions.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.recipientName}</td>
                  <td>{transaction.amount} {transaction.currency}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.phoneNumber}</td>
                  <td>
                    <span className={`status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;