import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Healthcare Communication Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Team CodeTrio - COMP3820 Project
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-status-blue">
                    Items Requiring Action
                  </h2>
                  <p className="text-3xl font-bold mt-2">6</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-status-orange">
                    Overdue
                  </h2>
                  <p className="text-3xl font-bold mt-2">3</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-status-green">
                    Actioned
                  </h2>
                  <p className="text-3xl font-bold mt-2">12</p>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;