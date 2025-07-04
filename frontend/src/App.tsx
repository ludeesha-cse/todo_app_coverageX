import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Tasks from './pages/Tasks';
import SignIn from './pages/Sign-in';
import SignUp from './pages/Sign-up';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Tasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;