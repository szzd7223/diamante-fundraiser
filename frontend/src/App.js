import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import CreateFundraiser from './CreateFundraiser';
import Fund from './Fund';
import logo from './logo-fundrise.jpg'
import CreateClaimableBalance from './CreateClaimableBalance';
import ClaimClaimableBalance from './ClaimClaimableBalance';

function Home() {
  return (
    <div className="App">
      <img src={logo} alt="Your Logo" className="logo" />
      <h1>Diamante Fundraiser</h1>
      <section>
        <Link to="/create-fundraiser">
          <button>Create Fundraiser</button>
        </Link>
        
        <Link to="/fund">
          <button>Fund</button>
        </Link>
        <Link to="/claim-claimable-balance">
          <button>Claim Fundraiser Balance</button>
        </Link>
      </section>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create-fundraiser" element={<CreateFundraiser />} />
        
        <Route path="/fund" element={<Fund />} />
        <Route path="/claim-claimable-balance" element={<ClaimClaimableBalance />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
