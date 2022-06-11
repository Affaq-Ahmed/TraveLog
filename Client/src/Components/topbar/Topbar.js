import React, { useContext } from "react";
import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Topbar({ setIsSearch, setSearch }) {
	const { user, dispatch } = useContext(AuthContext);
	const PF = process.env.REACT_APP_PF;

	const handlePress = (e) => {
		if (e.key === "Enter") {
			setIsSearch(true);
		}
	};

	const handleLogout = (e) => {
		e.preventDefault();
		dispatch({ type: "LOGOUT" });
		window.location.href = "/";
	};

	return (
		<div className="topbarContainer">
			<div className="topbarLeft">
				<Link to="/" style={{ textDecoration: "none" }}>
					<span className="logo">TraveLog</span>
				</Link>
			</div>
			<div className="topbarCenter">
				<div className="searchBar">
					<Search className="searchIcon" />
					<input
						type="text"
						placeholder="Search..."
						className="searchInput"
						onChange={(e) => setSearch(e.currentTarget.value)}
						onKeyDown={handlePress}
					/>
				</div>
			</div>
			<div className="topbarRight">
				<div className="topbarLinks">
					<Link to="/" style={{ textDecoration: "none" }}>
						<span className="topbarLink">Homepage</span>
					</Link>
					<Link
						to={`/profile/${user.username}`}
						style={{ textDecoration: "none" }}
					>
						<span className="topbarLink">Timeline</span>
					</Link>

					<span className="topbarLink" onClick={handleLogout}>
						Logout
					</span>
				</div>
				<Link
					to={`/editProfile/${user.username}`}
					state={{ userToUpdate: user }}
					style={{ textDecoration: "none" }}
				>
					<img
						src={
							user.profilePicture
								? PF + user.profilePicture
								: "/assets/person/noAvatar.png"
						}
						alt=""
						className="topbarImg"
					/>
				</Link>
			</div>
		</div>
	);
}
