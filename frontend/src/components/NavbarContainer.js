import React, { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import { logout, getUserType } from '../API';
import { Link, NavLink } from 'react-router-dom';
function NavbarContainer(props) {
	const [isLoggedIn, setLoggedIn] = useState();
	useEffect(() => {
		setLoggedIn(props.isLoggedIn);
	}, [props]);
	return (
		<div>
			<Navbar bg="dark" variant="dark" expand="lg">
				<Container>
					<Link to="/" className="navbar-brand">
						UBER
					</Link>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse className="justify-content-end">
						<Nav>
							{isLoggedIn && (
								<NavLink className="nav-link" to="/dashboard">
									Dashboard
								</NavLink>
							)}
							{getUserType() === 'dealer' && (
								<NavLink className="nav-link" to="/dealer/bookings">
									Bookings
								</NavLink>
							)}
							{!isLoggedIn && (
								<>
									{' '}
									<NavDropdown title="Dealer">
										<NavDropdown.Item>
											<NavLink className="nav-link  text-dark" to="/dealer/login">
												Login
											</NavLink>
										</NavDropdown.Item>
										<NavDropdown.Item>
											<NavLink className="nav-link  text-dark" to="/dealer/register">
												Register
											</NavLink>
										</NavDropdown.Item>
									</NavDropdown>
									<NavDropdown title="Driver">
										<NavDropdown.Item>
											<NavLink className="nav-link  text-dark" to="/driver/login">
												Login
											</NavLink>
										</NavDropdown.Item>
										<NavDropdown.Item>
											<NavLink className="nav-link  text-dark" to="/driver/register">
												Register
											</NavLink>
										</NavDropdown.Item>
									</NavDropdown>
								</>
							)}
							{isLoggedIn && (
								<Button className="nav-link" variant="dark" onClick={logout}>
									Logout
								</Button>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</div>
	);
}

export default NavbarContainer;
