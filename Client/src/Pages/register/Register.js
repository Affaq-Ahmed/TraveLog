import React, { useRef } from "react";
import "./register.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
	const username = useRef();
	const password = useRef();
	const confirmPassword = useRef();
	const email = useRef();
	const firstName = useRef();
	const lastName = useRef();
	const dateOfBirth = useRef();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password.current.value !== confirmPassword.current.value) {
			password.current.setCustomValidity("Passwords don't Match");
		} else {
			const user = {
				username: username.current.value,
				password: password.current.value,
				email: email.current.value,
				firstName: firstName.current.value,
				lastName: lastName.current.value,
				dateOfBirth: dateOfBirth.current.value,
			};
			try {
				const res = await axios.post("/auth/register", user);
				console.log(res);

				navigate("/login");
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<div className="register">
			<div className="registerWrapper">
				<div className="registerLeft">
					<h3 className="registerLogo">TraveLog</h3>
					<span className="registerDesc">
						Share your Travel Journeys here with your friends.
					</span>
					<button className="registerWithGoogleButton">
						Login with Google
					</button>
				</div>
				<div className="registerRight">
					<form className="registerBox" onSubmit={handleSubmit}>
						<div className="registerBoxHeader">
							<span className="registerBoxHeaderText">Register</span>
						</div>
						<input
							type="text"
							className="registerInput"
							placeholder="First Name"
							required
							autoFocus={true}
							ref={firstName}
						/>
						<input
							type="text"
							className="registerInput"
							placeholder="Last Name"
							required
							ref={lastName}
						/>

						<input
							type="text"
							className="registerInput"
							placeholder="Username"
							required
							ref={username}
						/>
						<input
							type="email"
							className="registerInput"
							placeholder="Email"
							required
							ref={email}
						/>
						<input
							type="date"
							className="registerInput"
							placeholder="Date of Birth"
							required
							ref={dateOfBirth}
						/>
						<input
							type="password"
							className="registerInput"
							placeholder="Password"
							minLength="6"
							required
							ref={password}
						/>
						<input
							type="password"
							className="registerInput"
							placeholder="Confirm Password"
							minLength="6"
							required
							ref={confirmPassword}
						/>
						<button className="registerButton" type="submit">
							Register
						</button>
						<Link to="/login" style={{ textDecoration: "none" }}>
							<button className="registerLoginButton">Login to Account</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
