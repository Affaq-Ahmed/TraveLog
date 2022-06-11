import React, { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
	const username = useRef();
	const password = useRef();
	const { user, isFetching, dispatch } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleGoogle = () => {
		window.open("http://localhost:8800/api/auth/google", "_self");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		loginCall(
			{ username: username.current.value, password: password.current.value },
			dispatch
		);
		navigate("/");
		console.log(user);
	};

	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">TraveLog</h3>
					<span className="loginDesc">
						Share your Travel Journeys here with your friends.
					</span>
					<button className="loginWithGoogleButton" onClick={handleGoogle}>
						{isFetching ? (
							<CircularProgress color="inherit" size="25px" />
						) : (
							"Login with Google"
						)}
					</button>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleSubmit}>
						<div className="loginBoxHeader">
							<span className="loginBoxHeaderText">Login</span>
						</div>
						<input
							type="text"
							className="loginInput"
							placeholder="Username"
							required
							autoFocus={true}
							ref={username}
						/>
						<input
							type="password"
							className="loginInput"
							placeholder="Password"
							minLength={6}
							required
							ref={password}
						/>
						<button className="loginButton" type="submit" disabled={isFetching}>
							{isFetching ? (
								<CircularProgress color="inherit" size="15px" />
							) : (
								"Log In"
							)}
						</button>
						<Link to="/forgot">
							<span className="loginForgot">Forgot Password?</span>
						</Link>
						<Link to="/register">
							<button className="loginRegisterButton">
								{isFetching ? (
									<CircularProgress color="inherit" size="15px" />
								) : (
									"Create an Account"
								)}
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
