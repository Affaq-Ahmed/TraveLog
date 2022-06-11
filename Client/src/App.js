import Home from "./Pages/home/Home";
import Login from "./Pages/login/Login";
import Profile from "./Pages/profile/Profile";
import Register from "./Pages/register/Register";
import ForgotPassword from "./Pages/forgotPassword/ForgotPassword";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import EditProfile from "./Pages/editProfile/EditProfile";
import Messenger from "./Pages/messenger/Messenger";
import ResetPassword from "./Pages/resetPassword/ResetPassword";

function App() {
	const { user } = useContext(AuthContext);

	return (
		<>
			<Router>
				<Routes>
					<Route exact path="/" element={user ? <Home /> : <Register />} />
					<Route
						path="/login"
						element={user ? <Navigate to="/" /> : <Login />}
					/>
					<Route
						path="/register"
						element={user ? <Navigate to="/" /> : <Register />}
					/>
					<Route path="/profile/:username" element={<Profile />} />
					<Route path="/editProfile/:username" element={<EditProfile />} />
					<Route path="/messenger" element={<Messenger />} />
					<Route path="/forgot" element={<ForgotPassword />} />
					<Route path="/reset/:token" element={<ResetPassword />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
