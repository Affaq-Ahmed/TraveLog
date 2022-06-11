import React, { useContext, useRef, useState } from "react";
import "./share.css";
import { Cancel, PermMedia } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
	const { user } = useContext(AuthContext);
	const description = useRef();
	const [image, setImage] = useState(null);
	const PF = process.env.REACT_APP_PF;

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newPost = {
			userId: user._id,
			description: description.current.value,
		};
		if (image) {
			const data = new FormData();
			const filename = Date.now() + image.name;
			data.append("name", filename);
			data.append("image", image);
			newPost.image = filename;
			try {
				const res = await axios.post("/upload", data);
				console.log(res);
			} catch (error) {
				console.log(error);
			}
		}
		try {
			const res = await axios.post("/posts", newPost);
			console.log(res);
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={image ? "shareImg" : "share"}>
			<div className="shareWrapper">
				<div className="shareTop">
					<img
						src={
							user.profilePicture
								? PF + user.profilePicture
								: "/assets/person/noAvatar.png"
						}
						alt=""
						className="shareProfilePicture"
					/>
					<input
						placeholder={"Share a Journey " + user.firstName + "?"}
						className="shareInput"
						ref={description}
					/>
				</div>
				<hr className="shareHr" />
				{image && (
					<div className="shareImgContainer">
						<img src={URL.createObjectURL(image)} alt="" className="shareImg" />
						<Cancel className="shareCancel" onClick={() => setImage(null)} />
					</div>
				)}
				<form className="shareBottom" onSubmit={handleSubmit}>
					<div className="shareOptions">
						<label htmlFor="file" className="shareOption">
							<PermMedia htmlColor="tomato" />
							<span className="shareOptionText">Photos</span>
							<input
								type="file"
								id="file"
								accept=".png,.jpg,.jpeg"
								onChange={(e) => setImage(e.target.files[0])}
								style={{ display: "none" }}
							/>
						</label>
					</div>
					<button className="shareButton" type="submit">
						Share
					</button>
				</form>
			</div>
		</div>
	);
}
