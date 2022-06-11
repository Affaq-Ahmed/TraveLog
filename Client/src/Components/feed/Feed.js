import React, { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username }) {
	const [posts, setPosts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [isEmpty, setIsEmpty] = useState(false);
	const [pageNumber, setPageNumber] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const { user } = useContext(AuthContext);

	const pages = new Array(totalPages).fill(null).map((v, i) => i);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = username
					? await axios.get(
							"/posts/profile/" + username + "?page=" + pageNumber
					  )
					: await axios.get(
							"posts/timeline/" + user._id + "?page=" + pageNumber
					  );

				setPosts(res.data.postsToReturn);
				setTotalPages(res.data.totalPages);

				console.log(res.data);

				setIsLoading(false);
				if (res.data.length === 0) {
					setIsEmpty(true);
				}
			} catch (error) {
				setIsError(true);
				console.log(error);
			}
		};
		fetchPosts();
	}, [username, user._id, pageNumber]);

	const previousPage = () => {
		setPageNumber(Math.max(0, pageNumber - 1));
	};

	const nextPage = () => {
		setPageNumber(Math.min(totalPages - 1, pageNumber + 1));
	};

	return (
		<>
			<div className="feed">
				<div className="feedWrapper">
					{(!username || username === user.username) && <Share />}
					{isLoading ? (
						<div className="feedLoading">
							<div className="feedLoadingIcon">
								<i className="fas fa-spinner fa-spin" />
							</div>
							<div className="feedLoadingText">
								<span>Loading...</span>
							</div>
						</div>
					) : isError ? (
						<div className="feedError">
							<div className="feedErrorIcon">
								<i className="fas fa-exclamation-triangle" />
							</div>
							<div className="feedErrorText">
								<span>Error!</span>
							</div>
						</div>
					) : isEmpty ? (
						<div className="feedEmpty">
							<div className="feedEmptyIcon">
								<i className="fas fa-exclamation-triangle" />
							</div>
							<div className="feedEmptyText">
								<span>No posts yet!</span>
							</div>
						</div>
					) : (
						posts.map((post) => <Post key={post._id} post={post} />)
					)}
					<div className="pagination">
						<button onClick={previousPage}>previous</button>
						{pages.map((pageIndex, key) => {
							return (
								<button key={key} onClick={() => setPageNumber(pageIndex)}>
									{pageIndex + 1}
								</button>
							);
						})}
						<button onClick={nextPage}>next</button>
					</div>
				</div>
			</div>
		</>
	);
}
