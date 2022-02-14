import React, { useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

function SnackbarCont(props) {
	const [open, setOpen] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setOpen(false);
		}, 3000);
	}, [setOpen]);
	return (
		<Snackbar
			anchorOrigin={{
				horizontal: 'left',
				vertical: 'bottom'
			}}
			open={open}
			message={props.title}
			ContentProps={{
				classes: {
					root: props.color
				}
			}}
		/>
	);
}

export default SnackbarCont;
