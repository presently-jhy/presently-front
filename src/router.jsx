import EventView from "./pages/eventView/eventView";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddEvent from "./pages/addEvent/addEvent";
import AddEventLog from "./pages/addEventLog/addEventLog";
import GiftEnroll from "./pages/GiftEnroll/GiftEnroll";
import FundSend from "./pages/FundSend/FundSend";
import Setting from "./pages/Setting/Setting";
import Profile from "./pages/Profile/Profile";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addEvent" element={<AddEvent />} />
        <Route path="/addEventLog" element={<AddEventLog />} />
        <Route path="/giftenroll" element={<GiftEnroll />} />
        <Route path="/fundsend" element={<FundSend />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/eventview" element={<EventView />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
