import React, { useState } from "react";
import Feed from "../../Components/feed/Feed";
import Leftbar from "../../Components/leftbar/Leftbar";
import Rightbar from "../../Components/rightbar/Rightbar";
import Search from "../../Components/search/Search";
import Topbar from "../../Components/topbar/Topbar";
import "./home.css";

export default function Home() {
	const [isSearch, setIsSearch] = useState(false);
	const [search, setSearch] = useState("");
	return (
		<>
			<Topbar setIsSearch={setIsSearch} setSearch={setSearch} />
			<div className="homeContainer">
				<Leftbar />
				{isSearch ? <Search search={search} /> : <Feed />}
				<Rightbar />
			</div>
		</>
	);
}
