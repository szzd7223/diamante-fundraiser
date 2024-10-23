// src/CreateFundraiser.js
import React, { useState } from 'react';

function CreateFundraiser() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [keypair, setKeypair] = useState({ publicKey: '', secret: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await generateKeypair(); // Generate keypair for the fundraiser
    
    const fundraiserData = {
      title,
      description,
      goal,
      publicKey: keypair.publicKey,
    };

    // Store the fundraiser data
    const response = await fetch('http://localhost:3001/store-fundraiser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fundraiserData),
    });

    const data = await response.json();
    setMessage(data.message);

    if (response.ok) {
        // 2. Call the Manage Data endpoint to store fundraiser data on Diamante Blockchain
        await manageDataOnBlockchain(fundraiserData);
    }
  };

  const generateKeypair = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-keypair', {
        method: 'POST',
      });
      const data = await response.json();
      setKeypair({
        publicKey: data.publicKey,
        secret: data.secret,
      });
      // setMessage(`Fundraiser created and data managed successfully! Your PublicKey is ${data.publicKey} and PrivateKey is ${data.secret}`);
    } catch (error) {
      console.error('Error generating keypair:', error);
    }
  };

  const manageDataOnBlockchain = async (fundraiserData) => {
    try {
        const { publicKey, title, goal } = fundraiserData;

        // Build the data payload to be sent to the manage-data endpoint
        const dataPayload = {
          senderSecret: publicKey, // Use the publicKey as senderSecret
          key: title,              // Use the fundraiser title as the key
          value: goal              // Use the fundraising goal as the value
        };
      const response = await fetch('http://localhost:3001/manage-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataPayload),
      });

      const data = await response.json();
      console.log('Manage Data Response:', data);
      setMessage(data.message || 'Fundraiser created and data managed successfully!');
    } catch (error) {
      console.error('Error managing data on blockchain:', error);
      setMessage('Error managing fundraiser data on the blockchain.');
    }
  };

  return (
    <div className="App">
      <h1>Create Fundraiser</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
        <button type="submit">Create Fundraiser</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateFundraiser;