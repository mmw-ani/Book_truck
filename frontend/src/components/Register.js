import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { registerUser } from '../API';
import States from '../States.json';
import SnackbarCont from './SnackbarCont';
const formField = {
	username: '',
	password: '',
	name: '',
	city: 'Nicobar',
	state: 'Andaman And Nicobar Island',
	mobileNumber: '',
	natureOfMaterial: '',
	weight: '',
	quantity: '',
	email: '',
	vehicleNumber: '',
	capacity: '',
	transporter: '',
	experience: '',
	preferredRoutes: [
		{ fromCity: '', fromState: '', toCity: '', toState: '' },
		{ fromCity: '', fromState: '', toCity: '', toState: '' },
		{ fromCity: '', fromState: '', toCity: '', toState: '' }
	]
};

const statesAndCities = {
	states: States.states,
	cities: States.states[0].districts
};
const preferredRoutes = [
	{
		from: {
			states: States.states,
			cities: States.states[0].districts
		},
		to: {
			states: States.states,
			cities: States.states[0].districts
		},
		fromCity: 'Nicobar',
		fromState: 'Andaman And Nicobar Island',
		toCity: 'Nicobar',
		toState: 'Andaman And Nicobar Island'
	},
	{
		from: {
			states: States.states,
			cities: States.states[0].districts
		},
		to: {
			states: States.states,
			cities: States.states[0].districts
		},
		fromCity: 'Nicobar',
		fromState: 'Andaman And Nicobar Island',
		toCity: 'Nicobar',
		toState: 'Andaman And Nicobar Island'
	},
	{
		from: {
			states: States.states,
			cities: States.states[0].districts
		},
		to: {
			states: States.states,
			cities: States.states[0].districts
		},
		fromCity: 'Nicobar',
		fromState: 'Andaman And Nicobar Island',
		toCity: 'Nicobar',
		toState: 'Andaman And Nicobar Island'
	}
];
function Register(props) {
	const [formData, setFormData] = useState(formField);
	const [error, setError] = useState();
	const [successResponse, setSuccessResponse] = useState();
	const [stateCity, setStateCity] = useState(statesAndCities);
	const [routes, setRoutes] = useState(preferredRoutes);
	const submitRegisterForm = async (event) => {
		event.preventDefault();
		formData.state = formData.state.split('_')[0];
		formData.preferredRoutes = routes.map((route) => {
			return {
				fromCity: route.fromCity,
				fromState: route.fromState.split('_')[0],
				toCity: route.toCity,
				toState: route.toState.split('_')[0]
			};
		});
		try {
			// console.log(formData);
			const response = await registerUser(formData, props.usedFor);
			setSuccessResponse(response.data.message);
			setFormData(formField);
			setRoutes(preferredRoutes);
		} catch (error) {
			setError(error.response.data.message);
			setTimeout(() => {
				setError();
			}, 3000);
		}
	};
	const setCity = (event, forPreferredRoutes = false, fromRoute = 'from', stateType = 'fromState', index = 0) => {
		const values = event.target.value.split('_');
		if (forPreferredRoutes) {
			const tempRoutes = [...routes];
			tempRoutes[index][fromRoute].cities = States.states[values[1] - 1].districts;
			tempRoutes[index][stateType] = event.target.value;
			setRoutes(tempRoutes);
		} else {
			setFormData({ ...formData, state: event.target.value });
			setStateCity({ ...stateCity, cities: States.states[values[1] - 1].districts });
		}
	};
	const handleChangePreferredCity = (event, index, type) => {
		const tempCity = [...routes];
		tempCity[index][type] = event.target.value;

		setRoutes(tempCity);
	};
	return (
		<Container>
			<Form className="mt-5 w-75 mx-auto" onSubmit={submitRegisterForm}>
				<Row>
					<Col xs={12}>
						<Form.Group className="mb-3">
							<Form.Label>Name</Form.Label>
							<Form.Control
								type="text"
								value={formData.name}
								onChange={(event) => setFormData({ ...formData, name: event.target.value })}
								placeholder="Enter your name"
								required
							/>
						</Form.Group>
					</Col>
					<Col xs={6}>
						<Form.Group className="mb-3">
							<Form.Label>Mobile Number</Form.Label>
							<Form.Control
								type="number"
								value={formData.mobileNumber}
								onChange={(event) => setFormData({ ...formData, mobileNumber: event.target.value })}
								placeholder="Enter your Mobile Number"
								required
							/>
						</Form.Group>
					</Col>
					<Col xs={6}>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								placeholder="Enter your email"
								value={formData.email}
								onChange={(event) => setFormData({ ...formData, email: event.target.value })}
								required
							/>
						</Form.Group>
					</Col>
					<Col xs={6}>
						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								value={formData.username}
								onChange={(event) => setFormData({ ...formData, username: event.target.value })}
								placeholder="Choose a username"
								required
							/>
						</Form.Group>
					</Col>
					<Col xs={6}>
						<Form.Group className="mb-3">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Enter your password"
								value={formData.password}
								onChange={(event) => setFormData({ ...formData, password: event.target.value })}
								required
							/>
						</Form.Group>
					</Col>
				</Row>
				{props.usedFor === 'driver' ? (
					<Row>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Age</Form.Label>
								<Form.Control
									type="number"
									value={formData.age}
									onChange={(event) => setFormData({ ...formData, age: event.target.value })}
									placeholder="Enter your age"
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Vehicle Number</Form.Label>
								<Form.Control
									type="text"
									value={formData.vehicleNumber}
									onChange={(event) => setFormData({ ...formData, vehicleNumber: event.target.value })}
									placeholder="Enter your vehicle number"
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Capacity</Form.Label>
								<Form.Control
									type="number"
									value={formData.capacity}
									onChange={(event) => setFormData({ ...formData, capacity: event.target.value })}
									placeholder="Enter your vehicle capacity"
								/>
							</Form.Group>
						</Col>
						<Col xs={6}>
							<Form.Group className="mb-3">
								<Form.Label>Transporter</Form.Label>
								<Form.Control
									type="text"
									value={formData.transporter}
									onChange={(event) => setFormData({ ...formData, transporter: event.target.value })}
									placeholder="Enter your transporter name"
								/>
							</Form.Group>
						</Col>
						<Col xs={6}>
							<Form.Group className="mb-3">
								<Form.Label>Experience</Form.Label>
								<Form.Control
									type="number"
									value={formData.experience}
									onChange={(event) => setFormData({ ...formData, experience: event.target.value })}
									placeholder="Years of experience"
								/>
							</Form.Group>
						</Col>
						<Form.Label>Preferred Routes</Form.Label>
						{[0, 1, 2].map((data) => {
							return (
								<Col xs={12} key={`preferredRoutes_${data}`}>
									<Form.Group className="mb-3">
										<Row>
											<Col xs={1} className="text-center mt-2">
												{data + 1}
											</Col>
											<Col xs={1} className="text-end mt-2">
												From
											</Col>
											<Col xs={2}>
												<Form.Select type="text" onChange={(event) => setCity(event, true, 'from', 'fromState', data)} value={routes[data].fromState}>
													{routes[data].from.states.map((state) => (
														<option value={`${state.name}_${state.id}`} key={'stateid' + state.id}>
															{state.name}
														</option>
													))}
												</Form.Select>
											</Col>
											<Col xs={2}>
												<Form.Select
													type="text"
													onChange={(event) => handleChangePreferredCity(event, data, 'fromCity')}
													required
													value={routes[data].fromCity}
												>
													{routes[data].from.cities?.map((city) => (
														<option value={city.name} key={'cityId' + city.id}>
															{city.name}
														</option>
													))}
												</Form.Select>
											</Col>

											<Col xs={1} className="text-end mt-2">
												To
											</Col>
											<Col xs={2}>
												<Form.Select type="text" onChange={(event) => setCity(event, true, 'to', 'toState', data)} value={routes[data].toState}>
													{routes[data].to.states.map((state) => (
														<option value={`${state.name}_${state.id}`} key={'stateid' + state.id}>
															{state.name}
														</option>
													))}
												</Form.Select>
											</Col>
											<Col xs={2}>
												<Form.Select
													type="text"
													onChange={(event) => handleChangePreferredCity(event, data, 'toCity')}
													required
													value={routes[data].toCity}
												>
													{routes[data].to.cities?.map((city) => (
														<option value={city.name} key={'cityId' + city.id}>
															{city.name}
														</option>
													))}
												</Form.Select>
											</Col>
										</Row>
									</Form.Group>
								</Col>
							);
						})}
					</Row>
				) : (
					<Row>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>State</Form.Label>
								<Form.Select type="text" value={formData.state} onChange={setCity} required>
									{stateCity?.states?.map((state) => (
										<option value={`${state.name}_${state.id}`} key={'stateid' + state.id}>
											{state.name}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>City</Form.Label>
								<Form.Select type="text" value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} required>
									{stateCity?.cities?.map((city) => (
										<option value={city.name} key={'cityId' + city.id}>
											{city.name}{' '}
										</option>
									))}
								</Form.Select>
							</Form.Group>
						</Col>

						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Nature of Material</Form.Label>
								<Form.Control
									type="text"
									placeholder="Nature of Material"
									value={formData.natureOfMaterial}
									onChange={(event) => setFormData({ ...formData, natureOfMaterial: event.target.value })}
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Weight</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter weight"
									value={formData.weight}
									onChange={(event) => setFormData({ ...formData, weight: event.target.value })}
								/>
							</Form.Group>
						</Col>
						<Col xs={4}>
							<Form.Group className="mb-3">
								<Form.Label>Quantity</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter Quantity"
									value={formData.quantity}
									onChange={(event) => setFormData({ ...formData, quantity: event.target.value })}
								/>
							</Form.Group>
						</Col>
					</Row>
				)}
				<Button variant="dark" type="submit">
					Register
				</Button>

				<p className="mt-3 ">
					Already having Account? <Link to={`/${props.usedFor}/login`}>Login Here!</Link>
				</p>
				{successResponse && <SnackbarCont title={successResponse} color="bg-success" />}
				{error && <SnackbarCont title={error} color="bg-danger" />}
			</Form>
		</Container>
	);
}

export default Register;
