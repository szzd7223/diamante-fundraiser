// src/ClaimClaimableBalance.js

import React, { useState } from 'react';

function ClaimClaimableBalance() {
  const [balanceId, setBalanceId] = useState('');
  const [message, setMessage] = useState('');

  const claimBalance = async () => {
    try {
      const response = await fetch('http://localhost:3001/claim-claimable-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          balanceId,
        }),
      });
      const data = await response.json();
      setMessage(data.message || 'Claimable balance claimed successfully!');
    } catch (error) {
      console.error('Error claiming claimable balance:', error);
      setMessage('Error claiming claimable balance.');
    }
  };

  return (
    <div className="App">
      <h1>Claim Fundriaser Balance</h1>
      <section>
        {/* <h2>Enter Balance ID to Claim</h2> */}
        <input
          type="text"
          placeholder="Enter Balance ID"
          value={balanceId}
          onChange={(e) => setBalanceId(e.target.value)}
        />
        <button onClick={claimBalance}>Claim Balance</button>
        <p>{message}</p>
      </section>
    </div>
  );
}

export default ClaimClaimableBalance;
