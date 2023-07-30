import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import InterfacePage from './pages/InterfacePage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<InterfacePage />} />
        </Routes>
    </Router>
  );
}

export default App;
