import React, { useEffect, useState } from "react";
import axios from "axios";
import "./search.css";
import { Link } from "react-router-dom";

export default function Search({ search }) {
	const [users, setUsers] = useState([]);
	const PF = process.env.REACT_APP_PF;

	useEffect(() => {
		const searchUsers = async (e) => {
			try {
				const res = await axios.get(`/users/search?search=${search}`);
				setUsers(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		searchUsers();
	}, [search]);

	return (
		<>
			<div className="search">
				<div className="searchWrapper">
					{users.map((user) => (
						<Link
							to={`/profile/${user.username}`}
							style={{ textDecoration: "none" }}
						>
							<div className="searchUser" key={user._id}>
								<img
									className="searchUserImage"
									src={
										user.profilePicture
											? PF + user.profilePicture
											: "/assets/person/noAvatar.png"
									}
									alt={user.username}
								/>
								<div className="searchUserInfo">
									<h3 className="searchUserName">
										{user.firstName} {user.lastName}
									</h3>
									<p className="searchUserSubname">{user.username}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
