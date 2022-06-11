import React, { useEffect, useState } from "react";
import axios from "axios";
import "./comment.css";
import { format } from "timeago.js";
import { Link } from "react-router-dom";

export default function Comment({ comment }) {
	const [user, setUser] = useState({});
	const PF = process.env.REACT_APP_PF;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/users?userId=${comment.userId}`);
				setUser(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, [comment.userId]);

	return (
		<div className="comment">
			<div className="commentTop">
				<div className="commentTopLeft">
					<Link
						to={`profile/${user.username}`}
						style={{ textDecoration: "none" }}
					>
						<img
							src={
								user.profilePicture
									? PF + user.profilePicture
									: "/assets/person/noAvatar.png"
							}
							alt=""
							className="commentProfileImage"
						/>
					</Link>
					<span className="commentProfileName">
						{user.firstName} {user.lastName}
					</span>
				</div>
				<div className="commentTopRight">
					<span className="commentTime">{format(comment.createdAt)}</span>
				</div>
			</div>
			<div className="commentCenter">
				<span className="commentText">{comment.description}</span>
			</div>
			
		</div>
	);
}
