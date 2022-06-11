import React, { useRef } from "react";
import "./forgotPassword.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
	const username = useRef();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("/auth/reset-password", {
				username: username.current.value,
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
							<span className="loginBoxHeaderText">Forgot Password</span>
						</div>
						<input
							type="text"
							className="loginInput"
							placeholder="Username"
							required
							autoFocus={true}
							ref={username}
						/>
						<button className="loginButton" type="submit">
							Send
						</button>
						<Link to="/login" style={{textDecoration: "none"}}>
							<button className="loginRegisterButton">Login Page</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
