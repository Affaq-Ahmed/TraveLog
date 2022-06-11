import React, { useContext, useEffect, useState } from "react";
import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@mui/icons-material";

export default function Rightbar({ user }) {
	const PF = process.env.REACT_APP_PF;
	const [friends, setFriends] = useState([]);
	const { user: currentUser, dispatch } = useContext(AuthContext);
	const [followed, setFollowed] = useState(
		currentUser.following.includes(user?._id)
	);

	useEffect(() => {
		setFollowed(currentUser.following.includes(user?._id));
	}, [currentUser, user]);

	useEffect(() => {
		const getFriends = async () => {
			try {
				console.log(user);
				const res = await axios.get("/users/friends/" + user?._id);
				setFriends(res.data);
				console.log(res.data);
			} catch (error) {
				console.log(error);
			}
		};
		getFriends();
	}, [user]);

	const handleFollow = async () => {
		try {
			if (followed) {
				const res = await axios.put("/users/unfollow/" + user._id, {
					userId: currentUser._id,
				});
				console.log(res);
				setFollowed(false);
				dispatch({ type: "UNFOLLOW", payload: user._id });
			} else {
				const res = await axios.put("/users/follow/" + user._id, {
					userId: currentUser._id,
				});
				console.log(res);
				setFollowed(true);
				dispatch({ type: "FOLLOW", payload: user._id });
			}
		} catch (error) {
			console.log(error);
		}
	};

	const HomeRightBar = () => {
		return (
			<>
				<img className="rightbarAd" src="assets/ad.png" alt="" />
				<img className="rightbarAd" src="assets/post/3.jpeg" alt="" />
			</>
		);
	};

	const ProfileRightBar = () => {
		return (
			<>
				{user.username !== currentUser.username && (
					<button className="rightbarFollowButton" onClick={handleFollow}>
						{followed ? "Unfollow" : "Follow"}
						{followed ? <Remove /> : <Add />}
					</button>
				)}
				<h4 className="rightbarTitle">User Information</h4>
				<div className="rightbarInfo">
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">City:</span>
						<span className="rightbarInfoValue">{user.city}</span>
					</div>
					<div className="rightbarInfoItem">
						<span className="rightbarInfoKey">From:</span>
						<span className="rightbarInfoValue">{user.from}</span>
					</div>
				</div>
				<h4 className="rightbarTitle">User Friends</h4>
				<div className="rightbarFollowings">
					{friends.map((friend) => (
						<Link
							to={"/profile/" + friend.username}
							key={friend.username}
							style={{ textDecoration: "none", color: "black" }}
						>
							<div className="rightbarFollowing">
								<img
									src={
										friend.profilePicture
											? PF + friend.profilePicture
											: "/assets/person/noAvatar.png"
									}
									alt=""
									className="rightbarFollowingImage"
								/>
								<span className="rightbarFollowingName">
									{friend.firstName + " " + friend.lastName}
								</span>
							</div>
						</Link>
					))}
				</div>
			</>
		);
	};

	return (
		<div className="rightbar">
			<div className="rightbarWrapper">
				{user ? <ProfileRightBar /> : <HomeRightBar />}
			</div>
		</div>
	);
}
