import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
// import FlatButton from '@material-ui/core/Button';
// import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
	button: {
		margin: theme.spacing(1),
	},
	input: {
		display: "none",
	},
});

const SubmitButtonComponent = (props) => {
	const handleClick = (e) => {
		const { saving } = props;
		if (saving) {
			// prevent double submission
			e.preventDefault();
		}
		else {
			// always submit form explicitly regardless of button type
			const { handleSubmitWithRedirect, redirect } = props;
			if (e) {
				e.preventDefault();
			}
			handleSubmitWithRedirect(redirect);
		}
	};

	const {
		saving, label = "ra.action.save", raised = true, submitOnEnter/* , redirect */, classes, translate
	} = props;
	const type = submitOnEnter ? "submit" : "button";
	return (
		<Button
			type={type}
			className={classes.button}
			onClick={handleClick}
			color={!saving ? "primary" : "secondary"}
			variant={raised ? "contained" : null}
			style={{
				margin: "10px 24px",
				position: "relative",
			}}
		>
			{label && translate(label)}
		</Button>
	);
};

SubmitButtonComponent.defaultProps = {
	raised: true,
	saving: false,
	submitOnEnter: true,
	redirect: false,
	classes: { button: null },
	handleSubmitWithRedirect: () => () => {},
};

SubmitButtonComponent.propTypes = {
	label: PropTypes.string.isRequired,
	raised: PropTypes.bool,
	saving: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.bool,
	]),
	submitOnEnter: PropTypes.bool,
	handleSubmitWithRedirect: PropTypes.func,
	redirect: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.bool,
	]),
	classes: PropTypes.shape({
		button: PropTypes.string
	}),
	translate: PropTypes.func.isRequired
};


const mapStateToProps = (state) => ({
	saving: state.admin.saving,
});

export default connect(mapStateToProps)(withStyles(styles)(SubmitButtonComponent));
