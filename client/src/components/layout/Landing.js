import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  componentDidMount() {
    // simple redirect if someone goes to the root , /, but are already logged in
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div className="landing">
        <div className="info-card-right">
          <h1> Welcome to The Coffee Quarters!</h1>
          <h2>Create a profile and share recipes or favorite other recipes.</h2>
          <h2>
            signing in with your phone will allow you to weigh your beans right
            on your phone!
          </h2>
        </div>
        <Link to="/register" className="btn btn-lg btn-info mr-2">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-lg btn-light">
          Login
        </Link>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
