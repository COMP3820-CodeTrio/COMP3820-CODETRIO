import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CommunicationDashboard from './components/CommunicationDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CommunicationDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;