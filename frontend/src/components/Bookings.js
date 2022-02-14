import React, { useState, useEffect } from 'react';
import { getBookingForDealer, getUserType } from '../API';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
function Bookings(props) {
	const userType = getUserType();
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		if (!props.isLoggedIn || userType !== 'dealer') {
			navigate('/dealer/login', { replace: true });
		}
		async function getAllBookings() {
			const response = await getBookingForDealer();
			setData(response.data.message);
		}
		getAllBookings();
	}, [navigate, userType, props]);
	return (
		<Container className="py-4">
			{data.length > 0 ? (
				<>
					<h5 className="text-center py-4">Bookings</h5>
					<Table striped bordered hover className="py-3">
						<thead>
							<tr>
								<th>#</th>
								<th>Name</th>
								<th>Age</th>
								<th>Contact No.</th>
								<th>Experience</th>
								<th>Capacity</th>
								<th>Vehicle Number</th>
								<th>Transporter</th>
								<th>From</th>
								<th>To</th>
								<th>Date</th>
								<th>View</th>
							</tr>
						</thead>
						<tbody>
							{data.map((item, index) => {
								return (
									<tr key={`dealerBookings_${index}`}>
										<td>{index + 1}</td>
										<td>{item.name}</td>
										<td>{item.age}</td>
										<td>{item.mobileNumber}</td>
										<td>{item.experience}</td>
										<td>{item.capacity}</td>
										<td>{item.vehicleNumber}</td>
										<td>{item.transporter}</td>
										<td>{item.from}</td>
										<td>{item.to}</td>
										<td>{item.date}</td>
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
				</>
			) : (
				<h5 className="py-3 text-center">No Bookings till now!</h5>
			)}
		</Container>
	);
}

export default Bookings;
