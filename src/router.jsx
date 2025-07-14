import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import AddEvent from './pages/addEvent/addEvent.jsx';
import AddEventLog from './pages/addEventLog/addEventLog.jsx';
import GiftEnroll from './pages/GiftEnroll/GiftEnroll';
import FundSend from './pages/FundSend/FundSend';
import Setting from './pages/Setting/Setting';
import Profile from './pages/Profile/Profile';
import EventView from './pages/EventView/EventView';
import ComponentShowcase from './pages/ComponentShowcase/ComponentShowcase';

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addEvent" element={<AddEvent />} />
            <Route path="/addEventLog" element={<AddEventLog />} />
            <Route path="/giftenroll" element={<GiftEnroll />} />
            <Route path="/fundsend" element={<FundSend />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/eventview/:eventId" element={<EventView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/showcase" element={<ComponentShowcase />} />
        </Routes>
    );
}
