import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../../assets/Logo_invert.png"
import Menu from "../Menu";
import "./Sidebar.css";

const Sidebar = () => {
	return(
		<aside className='sidebar'>
			<Link to="/projects">
				<img className='logo' src={logo} alt="Funnelsmap" />
			</Link>
			<Menu />
		</aside>
	);
}

export default Sidebar;
