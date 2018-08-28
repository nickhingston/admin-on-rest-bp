import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
// import FlatButton from '@material-ui/core/Button';
//import CircularProgress from '@material-ui/core/CircularProgress';
import { translate } from 'react-admin';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    input: {
      display: 'none',
    },
  });

export class SubmitButton extends Component {

    handleClick = (e) => {
        if (this.props.saving) {
            // prevent double submission
            e.preventDefault();
        } else {
            // always submit form explicitly regardless of button type
            const { handleSubmitWithRedirect, redirect } = this.props;
            if (e) {
                e.preventDefault();
            }
            handleSubmitWithRedirect(redirect)();
        }
    }

    render() {
        const { saving, label = 'ra.action.save', raised = true, translate, submitOnEnter/*, redirect*/, classes } = this.props;
        const type = submitOnEnter ? 'submit' : 'button';
        // const ButtonComponent = raised ? RaisedButton : FlatButton;
        return (
            <Button
                type={type}
                className={classes.button}
                 //icon={saving && saving.redirect === redirect ? <CircularProgress size={25} thickness={2} /> : <ContentSave />} 
                onClick={this.handleClick}
                color={!saving ? "primary" : "secondary"}
                variant={raised ? "contained" : null}
                style={{
                    margin: '10px 24px',
                    position: 'relative',
                }}
            >{label && translate(label)}</Button>
        );
    }
}

SubmitButton.propTypes = {
    label: PropTypes.string,
    raised: PropTypes.bool,
    saving: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
    ]),
    translate: PropTypes.func.isRequired,
    submitOnEnter: PropTypes.bool,
    handleSubmitWithRedirect: PropTypes.func,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    classes: PropTypes.object.isRequired
};

SubmitButton.defaultProps = {
    handleSubmitWithRedirect: () => () => {},
};

const mapStateToProps = state => ({
    saving: state.admin.saving,
});

export default connect(mapStateToProps)(withStyles(styles)(translate(SubmitButton)));
