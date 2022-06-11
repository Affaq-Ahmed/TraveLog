import React, { useEffect, useState } from "react";
import Feed from "../../Components/feed/Feed";
import Leftbar from "../../Components/leftbar/Leftbar";
import Rightbar from "../../Components/rightbar/Rightbar";
import Topbar from "../../Components/topbar/Topbar";
import "./profile.css";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Profile() {
	const [user, setUser] = useState({});
	const params = useParams();
	const username = params.username;
	const PF = process.env.REACT_APP_PF;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/users?username=${username}`);
				setUser(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, [username]);

	return (
		<>
			<Topbar />
			<div className="profileContainer">
				<Leftbar />
				<div className="profileRight">
					<div className="profileRightTop">
						<div className="profileCover">
							<img
								className="profileCoverImage"
								src={
									user.coverPicture
										? PF + user.coverPicture
										: "/assets/person/noCover.png"
								}
								alt=""
							/>
							<img
								className="profileUserImage"
								src={
									user.profilePicture
										? PF + user.profilePicture
										: "/assets/person/noAvatar.png"
								}
								alt=""
							/>
						</div>
						<div className="profileInfo">
							<h4 className="profileInfoName">
								{user.firstName + " " + user.lastName}
							</h4>
							<span className="profileInfoDesc">{user.description}</span>
						</div>
					</div>
					<div className="profileRightBottom">
						<Feed username={username} />
						<Rightbar user={user} />
					</div>
				</div>
			</div>
		</>
	);
}
