import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import SearchPage from "./components/Turf/SearchPage";
import TurfDetails from "./components/Turf/TurfDetails";
import MyTickets from "./components/Ticket/MyTickets";
import CreateTicket from "./components/Ticket/CreateTicket";
import Profile from "./components/Home/Profile";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signup" element={<Signup />} />,
        <Route path="/login" element={<Login />} />,
        <Route path="/home" element={<Home></Home>}></Route>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/search" element={<SearchPage></SearchPage>}></Route>
        <Route path="/turf/:turfId" element={<TurfDetails />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/turf/:turfId/create-ticket" element={<CreateTicket />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
