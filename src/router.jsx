import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import EventView from "./pages/eventView/eventView";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/eventview" element={<EventView />} />
      </Routes>
    </Router>
  );
}
