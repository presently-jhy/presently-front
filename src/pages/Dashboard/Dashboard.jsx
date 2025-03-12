import Eventbox from "../../components/eventbox/Eventbox";
import { useState } from "react";
const Dashboard = () => {
  const [eventImg, setEventImg] = useState("");

  return (
    <>
      eventImg, eventName, eventDate, eventView, eventPresent
      <div>Dashboard</div>
      <Eventbox eventImg={eventImg} />
      <Eventbox />
      <Eventbox />
      <Eventbox />
      <Eventbox />
      <Eventbox />
    </>
  );
};

export default Dashboard;
