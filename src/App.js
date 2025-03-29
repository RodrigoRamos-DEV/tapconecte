import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import CardForm from './Pages/CardForm';
import CardPreview from './Pages/CardPreview';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [cardData, setCardData] = useState(null);

  const handleCardSubmit = (data) => {
    setCardData(data);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CardForm onSubmit={handleCardSubmit} />} />
          <Route path="/preview" element={cardData ? <CardPreview cardData={cardData} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
