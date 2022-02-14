import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarContainer from './components/NavbarContainer';
import { Route, BrowserRouter as Router, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import { useState } from 'react';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DriverProfile from './components/DriverProfile';
import Bookings from './components/Bookings';
import Homepage from './components/Homepage';
import { isUserLoggedIn } from './API';
function App() {
	const [loggedIn, setLoggedIn] = useState(isUserLoggedIn());

	const handleLogin = (value) => {
		setLoggedIn(value);
	};
	return (
		<div className="website-background">
			<Router>
				<NavbarContainer isLoggedIn={loggedIn} />
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/dealer/login" element={<Login usedFor="dealer" triggeredLogin={handleLogin} />} />
					<Route path="/driver/login" element={<Login usedFor="driver" triggeredLogin={handleLogin} />} />
					<Route path="/dealer/register" element={<Register usedFor="dealer" />} />
					<Route path="/driver/register" element={<Register usedFor="driver" />} />
					<Route path="/dashboard" element={<Dashboard isLoggedIn={loggedIn} />} />
					<Route path="/driver/:driverId" element={<DriverProfile />} />
					<Route path="/dealer/bookings" element={<Bookings isLoggedIn={loggedIn} />} />
					<Route path="*" element={<NoRoutesFind />} />
				</Routes>
			</Router>
		</div>
	);
}

function NoRoutesFind() {
	return (
		<div className="text-center py-5">
			<h5 className="text-danger">No Routes Found</h5>
			<p className="py-3 fw-bold">
				Head Over to <Link to="/">Homepage</Link>
			</p>
		</div>
	);
}
export default App;
