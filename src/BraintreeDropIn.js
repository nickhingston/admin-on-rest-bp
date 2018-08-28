import React from "react";

import braintree from "braintree-web-drop-in";
import BraintreeDropin from "braintree-dropin-react";

import MuiFlatButton from '@material-ui/core/Button';

const apiUrl = process.env.REACT_APP_SERVICE_API;
// renderSubmitButton.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   isDisabled: PropTypes.bool.isRequired,
//   text: PropTypes.string.isRequired
// };

class BraintreeDropInComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCreate = this.onCreate.bind(this);
    this.onDestroyStart = this.onDestroyStart.bind(this);
    this.onDestroyEnd = this.onDestroyEnd.bind(this);
    this.onError = this.onError.bind(this);
    this.renderSubmitButton = this.renderSubmitButton.bind(this);
  }

  componentWillMount() {
    if (!this.state.token) {
      this.getToken();
    }
  }

  onCreate = instance => {
    this.setState({ dropinInstance: instance });
  }

  onDestroyStart = () => {
    // this.setState({ dropinInstance: null });
  }

  onDestroyEnd = () => {
    console.log("onDestroyEnd");
  }

  onError = () => {
    this.setState({ dropinInstance: null });
  }

  getToken = () => {
    const headers = { "Content-Type": "application/json" };

    const options = {
      method: "GET",
      headers
    };
    fetch(apiUrl + "/subscription/token?access_token=" + localStorage.token, options)
      .then(response => {
        response.json().then(json => {
          this.setState({ clientToken: json });
        });
      });
  }

  handlePaymentMethod = payload => {
    console.log("payload", payload);
    const headers = { "Content-Type": "application/json" };

    const options = {
      method: "PUT",
      headers,
      body: JSON.stringify({})
    };
    fetch(`${apiUrl}/subscription?access_token=${encodeURIComponent(localStorage.token)}&payment_method_nonce=${encodeURIComponent(payload.nonce)}&frequency=${this.props.record.frequency}`, options)
      .then(response => {
        if (response.ok) {
          this.setState({ dropinInstance: null });
          this.props.success();
        } else {
          this.setState({ clientToken: null });
          this.getToken();
          response.json()
            .then(json => {
              console.log(json);
              const errorMessage = json.error || "Payment failed: unknown";
              //this.props.uiActions.presentDialog(infoDialog("Error", errorMessage));
              console.log(response);
              this.props.failure(Error(errorMessage));
            })
            .catch(() => {
              const errorMessage = "Payment failed: network error?";
              // this.props.uiActions.presentDialog(infoDialog("Error", errorMessage));
              console.log(response);
              this.props.failure(Error(errorMessage));
            });
        }
      });
  }

  renderSubmitButton = ({ onClick, isDisabled, text }) => {
    if (this.state.dropinInstance) {
      return (
        <MuiFlatButton color="primary" variant="contained" disabled={isDisabled} key="add-user-button" label="Set Payment Method" onClick={onClick}>{this.props.submitButtonText}</MuiFlatButton>
        // <button
        //   onClick={onClick}
        //   disabled={isDisabled}
        //   className="ui blue button"
        //   style={{ float: "right" }}
        // >
        //   {text}
        // </button>
      );
    }
    return null;
  };

  render() {
    const token = this.state.clientToken;
    if (!token) {
      return null;
    }
    return (
      // <React.Fragment>
        <BraintreeDropin
          braintree={braintree}
          authorizationToken={token}
          handlePaymentMethod={this.handlePaymentMethod}
          onCreate={this.onCreate}
          onDestroyStart={this.onDestroyStart}
          onDestroyEnd={this.onDestroyEnd}
          onError={this.onError}
          renderSubmitButton={this.renderSubmitButton}
          paypal={{
            flow: "vault"
          }}
        />
      // </React.Fragment>
    );
  }
}

export default BraintreeDropInComponent;
