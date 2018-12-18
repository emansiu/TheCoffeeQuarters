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
        <div className="dropdown">
          <li>
            <Link to="/recipes"> Recipes</Link>
          </li>
          <li>
            <Link to="/#"> My Recipes</Link>
          </li>
          <li>
            <Link to="/#"> Favorite Recipes</Link>
          </li>
          <li>
            <Link to="/#"> Browse Recipes</Link>
          </li>
        </div>
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
        <div className="dropdown">
          <li className="dropbtn">
            <Link to="/recipes"> Recipes</Link>
          </li>
          <div className="dropdown-content">
            <li>
              <Link to="/#"> My Recipes</Link>
            </li>
            <li>
              <Link to="/#"> Favorite Recipes</Link>
            </li>
            <li>
              <Link to="/#"> Browse Recipes</Link>
            </li>
          </div>
        </div>
        <li className="link">
          <Link to="/register">Sign Up</Link>
        </li>
        <li className="link">
          <Link to="/login">Login</Link>
        </li>
      </ul>
    );

    return (
      <div className="navbarContainer">
        <div className="navbar clearfix">
          <ul className="left">
            <li className="title">
              <Link to="/">The Coffee Quarters</Link>
            </li>
          </ul>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
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
