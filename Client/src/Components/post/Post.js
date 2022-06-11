import React, { useContext, useEffect, useState, useRef } from "react";
import "./post.css";
import { MoreVert, ThumbUp, Comment as Com } from "@mui/icons-material";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Comment from "../Comment/Comment";

export default function Post(props) {
	const [isLiked, setIsLiked] = useState(false);
	const [user, setUser] = useState({});
	const [post, setPost] = useState(props.post);
	const [like, setLike] = useState(post.likes.length);
	const [comments, setComments] = useState(post.comments.length);
	const commentDescription = useRef();
	const { user: currentUser } = useContext(AuthContext);
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(post.description);
	const PF = process.env.REACT_APP_PF;

	const likeHandler = () => {
		try {
			const res = axios.put("/posts/like/" + post._id, {
				userId: currentUser._id,
			});
			console.log(res);
			setLike(isLiked ? like - 1 : like + 1);
			setIsLiked(!isLiked);
		} catch (error) {
			console.log(error);
		}
	};

	const commentHandler = () => {
		try {
			const res = axios.put("/posts/comment/" + post._id, {
				userId: currentUser._id,
				description: commentDescription.current.value,
			});
			console.log(res);
			setComments(comments + 1);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = () => {
		try {
			const res = axios.delete("/posts/" + post._id + "/" + currentUser._id);
			console.log(res);
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const handleEdit = () => {
		try {
			const res = axios.put("/posts/" + post._id, {
				userId: currentUser._id,
				description: description,
			});
			console.log(res);
			setIsEditing(false);
			window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/users?userId=${post.userId}`);
				setUser(res.data);
				if (post.likes.includes(currentUser._id)) setIsLiked(true);
			} catch (error) {
				console.log(error);
			}
		};
		fetchUser();
	}, [post.userId, currentUser._id, post.likes]);

	return (
		<div className="post">
			<div className="postWrapper">
				<div className="postTop">
					<div className="postTopLeft">
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
								className="postProfileImage"
							/>
						</Link>
						<span className="postProfileName">
							{user.firstName} {user.lastName}
						</span>
						<span className="postTime">{format(post.createdAt)}</span>
					</div>
					<div className="postTopRight">
						{/* <MoreVert className="postTopRightIcon" /> */}
						<i
							className="fas fa-ellipsis-h"
							type="button"
							id="post1Menu"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						></i>
						{/* <!-- edit menu --> */}
						<ul
							className="dropdown-menu border-0 shadow"
							aria-labelledby="post1Menu"
						>
							<li className="d-flex align-items-left">
								<button
									className="
                        dropdown-item
                        d-flex
                        justify-content-around
                        align-items-center
                        fs-7
                      "
									onClick={() => setIsEditing(true)}
								>
									Edit Post
								</button>
							</li>
							<li className="d-flex align-items-center">
								<button
									className="
                        dropdown-item
                        d-flex
                        justify-content-around
                        align-items-center
                        fs-7
                      "
									onClick={handleDelete}
								>
									Delete Post
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="postCenter">
					{isEditing ? (
						<>
							<input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="postInput"
							/>
							<button className="editButton" onClick={handleEdit}>
								Done
							</button>
						</>
					) : (
						<span className="postText">{post.description}</span>
					)}
					<img className="postImage" src={PF + post.image} alt="" />
				</div>
				<div className="postBottom">
					<div className="postBottomLeft">
						<img className="likeIcon" src="/assets/like.png" alt="" />
						<span className="postLikeCounter">
							{like > 0 ? like + " people liked" : "No likes yet"}
						</span>
					</div>
					<div className="postBottomRight">
						<span className="postCommentText">
							{comments > 0 ? comments + " comments" : "No comments yet"}{" "}
						</span>
					</div>
				</div>
				<hr className="postHr" />
				<div className="postBottomBottom">
					<div className=" postBottomBottomLike" onClick={likeHandler}>
						<ThumbUp className={`likeIcon && ${isLiked && "likeButton"}`} />
						<p>Like</p>
					</div>
					<div className="postBottomBottomLike">
						<Com className="likeIcon" />
						<p>Comment</p>
					</div>
				</div>
				<hr className="postHr2" />
				<div className="postComments">
					{post.comments.map((comment, key) => (
						<>
							<Comment key={key} comment={comment} />
							<hr className="commentHr" />
						</>
					))}

					<form className="createComment" onSubmit={commentHandler}>
						<input
							type="text"
							placeholder="Write a comment..."
							className="commentInput"
							ref={commentDescription}
							required
						/>
						<button className="commentButton" type="submit">
							Comment
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
