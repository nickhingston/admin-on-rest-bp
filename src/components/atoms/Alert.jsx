import React from "react";
import PropTypes from "prop-types";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button
} from "@material-ui/core";

const Alert = (props) => {
	const {
		open,
		closeAction,
		title,
		body,
		okOnly
	} = props;

	return (
		<Dialog
			open={open}
			onClose={closeAction}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{body}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeAction} color="primary">
					OK
				</Button>
				{ !okOnly && (
					<Button onClick={closeAction} color="primary" autoFocus>
						Cancel
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

Alert.defaultProps = {
	okOnly: true,
	closeAction: null,
	title: "",
	body: ""
};

Alert.propTypes = {
	open: PropTypes.bool.isRequired,
	closeAction: PropTypes.func,
	title: PropTypes.string,
	body: PropTypes.string,
	okOnly: PropTypes.bool
};

export default Alert;
