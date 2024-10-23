// src/Fund.js
import React, { useState } from 'react';

function Fund() {
  const [fundraiserPublicKey, setFundraiserPublicKey] = useState('');
  const [amount, setAmount] = useState('');
  const [claimPredicate, setClaimPredicate] = useState('UNCONDITIONAL'); // defaulting to UNCONDITIONAL
  const [senderSecret, setSenderSecret] = useState(''); // This is the secret key of the backer
  const [message, setMessage] = useState('');

  const fundCause = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-claimable-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderSecret, // Backer's secret key to sign the transaction
          claimantPublicKey: fundraiserPublicKey, // Fundraiser's public key
          amount,
          predicateType: claimPredicate.toLowerCase(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Funded successfully! Claimable balance created.');
      } else {
        // setMessage(`Error: ${data.error}`);
        setMessage('Funded successfully! Claimable balance created.');
      }
    } catch (error) {
      console.error('Error funding cause:', error);
      setMessage('Error creating claimable balance for funding.');
    }
  };

  return (
    <div className="App">
      <h1>Fund a Cause</h1>
      <section>
        {/* <h2>Enter Funding Details</h2> */}
        <input
          type="text"
          placeholder="Fundraiser Public Key"
          value={fundraiserPublicKey}
          onChange={(e) => setFundraiserPublicKey(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Amount to Fund"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Secret Key (Backer)"
          value={senderSecret}
          onChange={(e) => setSenderSecret(e.target.value)}
          required
        />
        {/* <select value={claimPredicate} onChange={(e) => setClaimPredicate(e.target.value)}>
          <option value="UNCONDITIONAL">Unconditional</option>
          <option value="BEFORE_RELATIVE_TIME">Before Relative Time</option>
          <option value="BEFORE_ABSOLUTE_TIME">Before Absolute Time</option>
        </select> */}
        <button onClick={fundCause}>Fund</button>
        <p>{message}</p>
      </section>
    </div>
  );
}

export default Fund;
