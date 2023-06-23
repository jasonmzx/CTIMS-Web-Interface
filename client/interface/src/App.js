import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Interface from './components/Interface';


function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Interface />} />
        </Routes>
    </Router>
  );
}

export default App;
