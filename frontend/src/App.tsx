import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Admin, Apply } from './pages/index';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/apply" replace />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
