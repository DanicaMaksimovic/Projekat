import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    Routes,
  } from "react-router-dom";
import StandupComedies from "../pages/StandupComedies";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import TicketHistory from "./User/TicketHistory";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import UserDetails from "./User/UserDetails";
import Events from "./Admin/Events";
import Homepage from "./Homepage";
import MusicalConcerts from "../pages/MusicalConcerts";
import EventPreview from "../pages/EventPreview";

const Page = () => {
    return <div className="page">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/stand-up-comedy" element={<StandupComedies />} />
        <Route path="/musical-concerts" element={<MusicalConcerts />} />
        <Route path="*" element={<div>Greska</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/event-preview/:eventId" element={<EventPreview />} />


        <Route path="/user">
            <Route path="ticket-history" element={<TicketHistory />} />
            <Route path="user-details" element={<UserDetails />} />
        </Route>

        <Route path="/admin">
            <Route path="events" element={<Events />} />
        </Route>
        
      </Routes> 
    </div>
}

export default Page;