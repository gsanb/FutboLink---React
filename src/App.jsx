import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./Home";
import CreateTeam from "./CreateTeam";  
import Teams from "./teams/Teams";
import Settings from "./Settings";
import PlayerProfileForm from "./players/PlayerProfileForm";
import PlayerProfile from "./players/PlayerProfile";
import TeamApplications from "./TeamApplications";
import ApplicationStatus from "./ApplicationStatus";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createTeam" element={<CreateTeam />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="createPlayer" element={<PlayerProfileForm/>} />
        <Route path="playerProfile/:id" element={<PlayerProfile />} />
        <Route path="/teamApplications" element={<TeamApplications />} />
        <Route path="/applicationStatus/:teamId" element={<ApplicationStatus />} />
        

      </Routes>
    </BrowserRouter>
  );
}
