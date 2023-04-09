import "./css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, useLocation, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Home from "./components/Home";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

const App = (props) => {
	const { user: currentUser } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	let location = useLocation();

	useEffect(() => {
		if(location.pathname === '/login' || location.pathname === '/register') {
			dispatch(clearMessage()); // clear message when changing location
		}
	}, [dispatch, location]);

	const logOut = (() => {
		dispatch(logout());
	}, [dispatch]);

	return (	
		<div className="App">
			<nav className="navbar navbar-expand navbar-dark bg-dark">
				<Link to={"/"} className="navbar-brand">
					Auth App
				</Link>
				<div className="navbar-nav mr-auto">
					<li className="nav-item">
						<Link to={"/"} className="nav-link">
							Home
						</Link>
					</li>
					{currentUser && (
						<li className="nav-item">
							<Link to={"/profile"} className="nav-link">
								Profile
							</Link>
						</li>
					)}
				</div>
				{currentUser ? (
					<div className="navbar-nav ml-auto">
						<li className="nav-item">
							<Link to={"/profile"} className="nav-link">
								{currentUser.username}
							</Link>
						</li>
						<li className="nav-item">
							<a href="/login" className="nav-link" onClick={() => logOut}>
								LogOut
							</a>
						</li>
					</div>
				) : (
					<div className="navbar-nav ml-auto">
						<li className="nav-item">
							<Link to={"/login"} className="nav-link">
								Login
							</Link>
						</li>
						<li className="nav-item">
							<Link to={"/register"} className="nav-link">
								Register
							</Link>
						</li>
					</div>
				)}
			</nav>
			<div className="container mt-3">
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path="/login" element={<Login />} />
					<Route exact path="/register" component={<Register />} />
					<Route exact path="/profile" component={<Profile />} />
				</Routes>
			</div>
		</div>
	);
}

export default App;