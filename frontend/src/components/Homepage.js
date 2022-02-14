import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import driver from '../images/truck_driver.jpg';
import driver2 from '../images/truck.png';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
function Homepage() {
	return (
		<Container className="py-5">
			<Row>
				<Col xs={6} className="d-flex flex-column justify-content-center">
					<h5 className="my-2">Want a driver to deliver your goods?</h5>
					<Button variant="text" className="w-50">
						<Link className="link-style" to="/dealer/register">
							Register
						</Link>
					</Button>

					<p className="mx-2 my-2">
						Already have an account?
						<Link className="link-style mx-1" to="/dealer/login">
							Login as Dealer
						</Link>
					</p>
				</Col>
				<Col xs={6}>
					<img className="w-75 shadow rounded" src={driver} alt="Truck Driver" />
				</Col>
			</Row>
			<Row className="my-4">
				<Col xs={6}>
					<img className="w-50 rounded" src={driver2} alt="Truck Driver" />
				</Col>
				<Col xs={6} className="d-flex flex-column justify-content-center">
					<h5 className="my-2">Are you a driver? Register here and get booked by verified dealer</h5>
					<Button variant="text" className="w-50">
						<Link className="link-style" to="/driver/register">
							Register
						</Link>
					</Button>

					<p className="mx-2 my-0">
						Already have an account?
						<Link className="link-style mx-1" to="/driver/login">
							Login as Driver
						</Link>
					</p>
				</Col>
			</Row>
		</Container>
	);
}

export default Homepage;
