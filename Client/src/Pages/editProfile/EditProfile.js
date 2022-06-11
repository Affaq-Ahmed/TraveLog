import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Leftbar from "../../Components/leftbar/Leftbar";
import Topbar from "../../Components/topbar/Topbar";
import "./editProfile.css";
import axios from "axios";
import { PermMedia, Cancel } from "@mui/icons-material";

export default function EditProfile() {
	const PF = process.env.REACT_APP_PF;
  const location = useLocation();
	const [user, setUser] = useState(location.state.userToUpdate);
	const [profilePicture, setProfilePicture] = useState("");
	const [coverPicture, setCoverPicture] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [description, setDescription] = useState("");
	const [city, setCity] = useState("");
	const [from, setFrom] = useState("");
	const [dob, setDob] = useState("");
  

	const setStates = (user) => {
		setFirstName(user.firstName);
		setLastName(user.lastName);
		setDescription(user.description);
		setCity(user.city);
		setFrom(user.from);
		setDob(user.dob);
	};

	useEffect(() => {
    setUser(user);
		setStates(user);
	}, [user]);

	const handleSubmit = (e) => {
		e.preventDefault();
		const updatedUser = {
			userId: user._id,
			description: description,
			firstName: firstName,
			lastName: lastName,
			city: city,
			from: from,
			dob: dob,
		};
		if (profilePicture) {
			const data = new FormData();
			const filename = Date.now() + profilePicture.name;
			data.append("name", filename);
			data.append("image", profilePicture);
			updatedUser.profilePicture = filename;
			try {
				const res = axios.post("/upload", data);
				console.log(res);
			} catch (error) {
				console.log(error);
			}
		}
		if (coverPicture) {
			const data = new FormData();
			const filename = Date.now() + coverPicture.name;
			data.append("name", filename);
			data.append("image", coverPicture);
			updatedUser.coverPicture = filename;
			try {
				const res = axios.post("/upload", data);
				console.log(res);
			} catch (error) {
				console.log(error);
			}
		}
		try {
			const res = axios.put("/users/" + user._id, updatedUser);
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Topbar />
			<div className="editProfile">
				<Leftbar />
				<div className="editProfileRight">
					<div className="editProfileRightTop">
						<div className="profileCover">
							{console.log(user)}
							<img
								className="editProfileCoverImage"
								src={
									user.coverPicture
										? PF + user.coverPicture
										: "/assets/person/noCover.png"
								}
								alt=""
							/>
							<img
								className="editProfileUserImage"
								src={
									user.profilePicture
										? PF + user.profilePicture
										: "/assets/person/noAvatar.png"
								}
								alt=""
							/>
						</div>
						<div className="editProfileInfo">
							<h4 className="editProfileInfoName">
								{user.firstName + " " + user.lastName}
							</h4>
							<span className="editProfileInfoDesc">{user.description}</span>
						</div>
					</div>
					<div className="editProfileRightBottom">
						<form onSubmit={handleSubmit} className="editProfileEdit">
							<div className="editProfileBoxHeader">
								<span className="editProfileBoxHeaderText">Edit Profile</span>
							</div>
							<label className="editProfileLabel">First Name:</label>
							<input
								type="text"
								className="editProfileInput"
								placeholder={firstName}
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								autoFocus={true}
							/>
							<label className="editProfileLabel">Last Name:</label>
							<input
								type="text"
								className="editProfileInput"
								placeholder={lastName}
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
							<label className="editProfileLabel">Your Description:</label>
							<input
								type="text"
								className="editProfileInput"
								placeholder={description ? description : "Description"}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
							<label className="editProfileLabel">Your City:</label>
							<input
								type="text"
								className="editProfileInput"
								placeholder={city ? city : "City"}
								value={city}
								onChange={(e) => setCity(e.target.value)}
								required
							/>
							<label className="editProfileLabel">Your Origin City:</label>
							<input
								type="text"
								className="editProfileInput"
								placeholder={from ? from : "From"}
								value={from}
								onChange={(e) => setFrom(e.target.value)}
								required
							/>
							<label className="editProfileLabel">Date of Birth:</label>
							<input
								type="date"
								className="editProfileInput"
								placeholder={dob ? dob : "Date of Birth"}
								value={dob}
								onChange={(e) => setDob(e.target.value)}
								required
							/>
							<label htmlFor="profilePhoto" className="editProfileLabel">
								Profile Photo
								<PermMedia htmlColor="tomato" />
								<input
									type="file"
									id="profilePhoto"
									accept=".png,.jpg,.jpeg"
									onChange={(e) => setProfilePicture(e.target.files[0])}
									style={{ display: "none" }}
								/>
							</label>
							{profilePicture && (
								<div className="shareImgContainer">
									<img
										src={URL.createObjectURL(profilePicture)}
										alt=""
										className="shareImg"
									/>
									<Cancel
										className="shareCancel"
										onClick={() => setProfilePicture(null)}
									/>
								</div>
							)}
							<label htmlFor="coverPhoto" className="editProfileLabel">
								Cover Photo
								<PermMedia htmlColor="tomato" />
								<input
									type="file"
									id="coverPhoto"
									accept=".png,.jpg,.jpeg"
									onChange={(e) => setCoverPicture(e.target.files[0])}
									style={{ display: "none" }}
								/>
							</label>
							{coverPicture && (
								<div className="shareImgContainer">
									<img
										src={URL.createObjectURL(coverPicture)}
										alt=""
										className="shareImg"
									/>
									<Cancel
										className="shareCancel"
										onClick={() => setCoverPicture(null)}
									/>
								</div>
							)}
							<button className="editProfileButton" type="submit">
								Update Profile
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
