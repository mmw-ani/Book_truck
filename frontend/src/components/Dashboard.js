import React, { useState, useEffect } from 'react';
import { Button, Container, Table } from 'react-bootstrap';
import { dashboardPage, getUserType, isUserLoggedIn } from '../API';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard(props) {
	const [data, setData] = useState([]);
	const userType = getUserType();
	const isLoggedIn = isUserLoggedIn();
	const navigate = useNavigate();
	useEffect(() => {
		if (!isLoggedIn) {
			navigate('/', { replace: true });
		}
		async function getDashboard() {
			const response = await dashboardPage();
			setData(response.data.message);
		}
		getDashboard();
	}, [isLoggedIn, navigate]);
	return (
		<Container className="py-5 text-center">
			<h5 className="mb-4">{userType === 'dealer' ? 'Driver travelling through your route' : 'My Bookings'}</h5>
			{userType === 'dealer' && (
				<Table striped bordered hover className="py-3">
					<thead>
						<tr>
							<th>#</th>
							<th>Driver Name</th>
							<th>Contact No.</th>
							<th>Age</th>
							<th>Experience</th>
							<th>Capacity</th>
							<th>Vehicle Number</th>
							<th>Transporter</th>
							<th>View</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => {
							return (
								<tr>
									<td>{index + 1}</td>
									<td>{item.name}</td>
									<td>{item.mobileNumber}</td>
									<td>{item.age}</td>
									<td>{item.experience}</td>
									<td>{item.capacity}</td>
									<td>{item.vehicleNumber}</td>
									<td>{item.transporter}</td>
									<td>
										<Link to={`/driver/${item.id}`}>
											<Button variant="dark">View </Button>
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
			{userType === 'driver' && (
				<Table striped bordered hover className="py-3">
					<thead>
						<tr>
							<th>#</th>
							<th>Dealer Name</th>
							<th>Contact No.</th>
							<th>Nature of Material</th>
							<th>Quantity</th>
							<th>Weight</th>
							<th>From</th>
							<th>To</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => {
							return (
								<tr>
									<td>{index + 1}</td>
									<td>{item.name}</td>
									<td>{item.mobileNumber}</td>
									<td>{item.natureOfMaterial}</td>
									<td>{item.quantity}</td>
									<td>{item.weight}</td>
									<td>{item.from}</td>
									<td>{item.to}</td>
									<td>{item.date}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			)}
		</Container>
	);
}

export default Dashboard;
