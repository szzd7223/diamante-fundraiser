// src/CreateClaimableBalance.js

import React, { useState } from 'react';

function CreateClaimableBalance() {
  const [asset, setAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [claimant, setClaimant] = useState('');
  const [claimPredicate, setClaimPredicate] = useState('UNCONDITIONAL');
  const [balanceId, setBalanceId] = useState('');
  const [message, setMessage] = useState('');

  const createClaimableBalance = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-claimable-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset,
          amount,
          claimant,
          claimPredicate,
        }),
      });
      const data = await response.json();
      setBalanceId(data.balanceId);
      setMessage('Claimable balance created successfully!');
    } catch (error) {
      console.error('Error creating claimable balance:', error);
      setMessage('Error creating claimable balance.');
    }
  };

  return (
    <div className="App">
      <h1>Create Claimable Balance</h1>
      <section>
        <h2>Enter Claimable Balance Details</h2>
        <input
          type="text"
          placeholder="Enter Asset (e.g., DIAM)"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Claimant's Public Key"
          value={claimant}
          onChange={(e) => setClaimant(e.target.value)}
        />
        <select value={claimPredicate} onChange={(e) => setClaimPredicate(e.target.value)}>
          <option value="UNCONDITIONAL">Unconditional</option>
          <option value="BEFORE_RELATIVE_TIME">Before Relative Time</option>
          <option value="NOT_BEFORE_RELATIVE_TIME">Not Before Relative Time</option>
        </select>
        <button onClick={createClaimableBalance}>Create Claimable Balance</button>
        <p><strong>Balance ID:</strong> {balanceId}</p>
        <p>{message}</p>
      </section>
    </div>
  );
}

export default CreateClaimableBalance;