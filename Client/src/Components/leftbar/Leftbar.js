import React, { useContext, useEffect, useState } from "react";
import "./leftbar.css";
import { RssFeed, Chat, Person } from "@mui/icons-material";
import { Users } from "../../dummyData";
import CLoseFriend from "../closeFriend/CLoseFriend";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Leftbar() {
	const { user } = useContext(AuthContext);
	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		const getFollowers = async () => {
			try {
				const res = await axios.get("/users/followers/" + user._id);
				console.log(res);
				setFollowers(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getFollowers();
	}, [user._id]);

	return (
		<div className="leftbar">
			<div className="leftbarWrapper">
				<span className="leftbarUserName">
					{user?.firstName + " " + user?.lastName}
				</span>
				<ul className="leftbarList">
					<li className="leftbarListItem">
						<RssFeed className="leftbarListItemIcon" />
						<span className="leftbarListItemText">Feed</span>
					</li>
					<Link
						to="/messenger"
						style={{ textDecoration: "none", color: "black" }}
					>
						<li className="leftbarListItem">
							<Chat className="leftbarListItemIcon" />
							<span className="leftbarListItemText">Chats</span>
						</li>
					</Link>
					<li className="leftbarListItem">
						<Person className="leftbarListItemIcon" />
						<span className="leftbarListItemText">Profile</span>
					</li>
				</ul>
				<hr className="leftbarHr" />
				<h4 className="rightbarTitle">Followers</h4>
				<ul className="leftbarFriendList">
					{followers.map((u) => (
						<CLoseFriend key={u._id} follower={u} />
					))}
				</ul>
			</div>
		</div>
	);
}
