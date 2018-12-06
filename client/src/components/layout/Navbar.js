import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isAuthenticated, user } = this.props.auth;

    // AUTHENTICATED USER AVAILABLE LINKS -----------------------------------------------------
    const authLinks = (
      <ul className="navbar">
        <li>
          <Link className="nav-link" to="/feed">
            Post Feed
          </Link>
        </li>
        <li>
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <a
            href="#"
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            <img
              className="rounded-circle"
              style={{ width: "25px", marginRight: "5px" }}
              src={user.avatar}
              alt={user.name}
              title="You must have a gravatar connected to your email to display an image"
            />
            {""}
            Logout
          </a>
        </li>
      </ul>
    );

    // GUEST AVAILABLE LINKS -----------------------------------------------------
    const guestLinks = (
      <ul className="right">
        <li>
          <Link to="/register">Sign Up</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    );

    return (
      <div className="navbar clearfix">
        <ul className="left">
          <li className="title">
            <Link to="/">The Coffee Quarters</Link>
          </li>
          <li>
            <Link to="/profiles"> Recipes</Link>
          </li>
        </ul>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
