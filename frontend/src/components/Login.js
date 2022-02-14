import React, { useState, useEffect } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { isUserLoggedIn, loginUser, sendOtpForLogin, verifyOTP } from '../API';
import SnackbarCont from './SnackbarCont';
function Login(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loginType, setLoginType] = useState('username');
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [otpSent, setOtpSent] = useState(false);
	const [error, setError] = useState();
	const [successResponse, setSuccessResponse] = useState();
	const [isLoggedIn, setLoggedIn] = useState(isUserLoggedIn());
	const navigate = useNavigate();
	const submitLoginForm = async (event) => {
		event.preventDefault();
		try {
			let response;
			if (loginType === 'username') {
				response = await loginUser({ username, password }, props.usedFor);
			} else {
				response = await verifyOTP({ otp, email }, props.usedFor);
			}
			localStorage.setItem('token', response.headers.auth_token);
			localStorage.setItem('user', JSON.stringify(response.data.user));
			// window.location.reload();
			setLoggedIn(true);
			props.triggeredLogin(true);
			setSuccessResponse(response.data.message);
			setUsername('');
			setPassword('');
		} catch (error) {
			setError(error.response.data.message);
		}
		setTimeout(() => {
			setSuccessResponse();
			setError();
		}, 3000);
	};
	useEffect(() => {
		if (isLoggedIn) {
			setSuccessResponse('Already Logged In');
			navigate('/dashboard', { replace: true });
		}
	}, [isLoggedIn, navigate]);
	const sendOtp = async () => {
		try {
			let response;
			response = await sendOtpForLogin({ email }, props.usedFor);
			setOtpSent(true);
			setSuccessResponse(response.data.message);
		} catch (error) {
			setError(error.response.data.message);
		}
		setTimeout(() => {
			setSuccessResponse();
			setError();
		}, 3000);
	};
	const setLoginTypeHandler = () => {
		if (loginType === 'username') {
			setLoginType('email');
		} else {
			setLoginType('username');
		}
	};
	return (
		<Container>
			{successResponse && <SnackbarCont title={successResponse} color="bg-success" />}
			{error && <SnackbarCont title={error} color="bg-danger" />}

			{loginType === 'username' ? (
				<Form className="my-5 w-75 mx-auto" onSubmit={submitLoginForm}>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" value={username} required={true} onChange={(event) => setUsername(event.target.value)} placeholder="Enter your username" />
					</Form.Group>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Enter your password" required={true} value={password} onChange={(event) => setPassword(event.target.value)} />
					</Form.Group>
					<Button variant="dark" type="submit">
						Login
					</Button>
					<p className="my-3">
						Not having Account? <Link to={`/${props.usedFor}/register`}>Register Here!</Link>
					</p>
					<Button variant="dark" onClick={setLoginTypeHandler}>
						{loginType === 'username' ? 'Login By Email' : 'Login By Username'}
					</Button>
				</Form>
			) : (
				<Form className="my-5 w-75 mx-auto" onSubmit={submitLoginForm}>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="text"
							required={true}
							value={email}
							disabled={otpSent}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="Enter your Email"
						/>
					</Form.Group>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
						<Form.Label>OTP</Form.Label>
						<Form.Control type="password" required={true} placeholder="Enter your OTP" value={otp} onChange={(event) => setOtp(event.target.value)} />
					</Form.Group>
					{!otpSent && (
						<Button variant="dark" onClick={sendOtp}>
							Send OTP
						</Button>
					)}
					{otpSent && (
						<Button variant="dark" type="submit">
							Login
						</Button>
					)}
					<p className="my-3">
						Not having Account? <Link to={`/${props.usedFor}/register`}>Register Here!</Link>
					</p>
					<Button variant="dark" onClick={setLoginTypeHandler}>
						{loginType === 'username' ? 'Login By Email' : 'Login By Username'}
					</Button>
				</Form>
			)}
		</Container>
	);
}

export default Login;
