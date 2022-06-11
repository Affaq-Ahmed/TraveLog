import React, { useRef } from "react";
import "./resetPassword.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
	const password = useRef();
	const navigate = useNavigate();
	const location = useLocation();
	const token = location.pathname.split("/")[2];
	console.log(token);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/auth/reset-password/" + token, {
				password: password.current.value,
			});
			console.log(res);
			navigate("/login");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">TraveLog</h3>
					<span className="loginDesc">
						Share your Travel Journeys here with your friends.
					</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleSubmit}>
						<div className="loginBoxHeader">
							<span className="loginBoxHeaderText">Add New Password</span>
						</div>
						<input
							type="password"
							className="loginInput"
							placeholder="Password"
							required
							autoFocus={true}
							ref={password}
						/>
						<button className="loginButton" type="submit">
							Send
						</button>
						<Link to="/register">
							<button className="loginRegisterButton">Login Page</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
