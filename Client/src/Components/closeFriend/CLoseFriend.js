import React from "react";
import { Link } from "react-router-dom";
import "./closefriend.css";

export default function CLoseFriend({ follower }) {
	const PF = process.env.REACT_APP_PF;

	return (
		<Link
			to={`/profile/${follower.username}`}
			style={{ textDecoration: "none" }}
		>
			<li className="leftbarFriendListItem">
				<img
					src={
						follower.profilePicture
							? PF + follower.profilePicture
							: "/assets/person/noAvatar.png"
					}
					alt=""
					className="leftbarFriendListItemImg"
				/>
				<span className="leftbarFriendListItemText">
					<span className="leftbarFriendListItemName">
						{follower.firstName + " " + follower.lastName}
					</span>
				</span>
			</li>
		</Link>
	);
}
