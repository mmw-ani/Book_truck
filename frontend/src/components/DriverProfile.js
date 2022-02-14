import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Table } from 'react-bootstrap';
import SnackbarCont from './SnackbarCont';
import { useParams } from 'react-router-dom';
import { bookingDriver, getDriverProfile, getUserType } from '../API';
function DriverProfile() {
	const [error, setError] = useState();
	const [successResponse, setSuccessResponse] = useState();
	const [driverDetail, setDriverDetail] = useState({});
	const [date, setDate] = useState(['', '', '']);
	const params = useParams();
	const driverId = params.driverId;
	const userType = getUserType();
	useEffect(() => {
		async function getProfile() {
			try {
				const response = await getDriverProfile(driverId);
				setDriverDetail(response.data.message);
			} catch (err) {
				setError(err.response.data.message);
			}
		}
		getProfile();
	}, [driverId]);
	const bookDriver = async (event, index, bookingId) => {
		event.preventDefault();
		const formData = {
			id: driverId,
			bookingId: bookingId,
			date: date[index]
		};
		try {
			const response = await bookingDriver(formData);
			setSuccessResponse(response.data.message);
			setDate(['', '', '']);
		} catch (err) {
			setError(error.response.data.message);
		}
		setTimeout(() => {
			setSuccessResponse();
			setError();
		}, 3000);
	};
	const handleSetDate = (event, index) => {
		const newDateObj = [...date];
		newDateObj[index] = event.target.value;
		setDate(newDateObj);
	};
	return (
		<Container>
			<Row className="py-4">
				<h3 className="text-center">Driver Details</h3>
				<Col xs={2} className="fw-bold">
					Name
				</Col>
				<Col xs={4}>{driverDetail.name}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Age
				</Col>
				<Col xs={9}>{driverDetail.age}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Contact No.
				</Col>
				<Col xs={9}>{driverDetail.mobileNumber}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Experience
				</Col>
				<Col xs={9}>{driverDetail.experience}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Capacity
				</Col>
				<Col xs={9}>{driverDetail.capacity}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Vehicle Number
				</Col>
				<Col xs={9}>{driverDetail.vehicleNumber}</Col>
				<hr />
				<Col xs={2} className="fw-bold">
					Transporter
				</Col>
				<Col xs={9}>{driverDetail.transporter}</Col>
				<hr />
			</Row>
			<Table striped bordered hover className="py-3">
				<thead>
					<tr>
						<th>#</th>
						<th>From City</th>
						<th>From State</th>
						<th>To City</th>
						<th>To State</th>
						{userType === 'dealer' && <th>Book</th>}
					</tr>
				</thead>
				<tbody>
					{driverDetail?.preferredRoutes?.map((item, index) => {
						return (
							<tr>
								<td>{index + 1}</td>
								<td>{item.fromCity}</td>
								<td>{item.fromState}</td>
								<td>{item.toCity}</td>
								<td>{item.toState}</td>

								{userType === 'dealer' && (
									<td>
										<form onSubmit={(event) => bookDriver(event, index, item._id)}>
											<input
												required={true}
												type="date"
												className="mx-3 "
												id="birthday"
												value={date[index]}
												onChange={(event) => handleSetDate(event, index)}
											/>

											<Button variant="dark" type="submit">
												Book
											</Button>
										</form>
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</Table>
			{error && <SnackbarCont title={error} color="bg-danger" />}
			{successResponse && <SnackbarCont title={successResponse} color="bg-success" />}
		</Container>
	);
}

export default DriverProfile;
