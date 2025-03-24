import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import AddEvent from './pages/addEvent/addEvent';
import AddEventLog from './pages/addEventLog/addEventLog';
import GiftEnroll from './pages/GiftEnroll/GiftEnroll';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/addEvent" element={<AddEvent />} />
                <Route path="/addEventLog" element={<AddEventLog />} />
                <Route path="/giftenroll" element={<GiftEnroll />} />
            </Routes>
        </Router>
    );
}
