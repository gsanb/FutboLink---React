import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateTeam from "./teams/CreateTeam";  
import Teams from "./teams/Teams";
import Settings from "./pages/Settings";
import PlayerProfileForm from "./players/PlayerProfileForm";
import PlayerProfile from "./players/PlayerProfile";
import TeamApplications from "./teams/TeamApplications";
import TeamDetails from "./teams/TeamDetails";
import PlayerApplicationPage from "./players/PlayerApplicationPage";
import Unauthorized from "./pages/Unauthorized";
import MyTeams from "./teams/MyTeams";
import EditTeam from "./teams/EditTeam";
import Chat from "./chat/Chat";
import ChatList from "./chat/ChatList";
import EditPlayerProfile from "./players/EditPlayerProfile";



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
            <Route path="/teams/:id" element={<TeamDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/createPlayer" element={<PlayerProfileForm/>} />
            <Route path="/playerProfile/:id" element={<PlayerProfile />} />
            <Route path="/teamApplications" element={<TeamApplications />} />
            <Route path="/applications" element={<PlayerApplicationPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/myTeams" element={<MyTeams />} />
            <Route path="/editTeam/:id" element={<EditTeam />} />
            <Route path="/chat/:applicationId" element={<Chat />} />
            <Route path="/chats" element={<ChatList />} />
            <Route path="/editPlayerProfile" element={<EditPlayerProfile />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            

          </Routes>
        </BrowserRouter>
   
  );
}
