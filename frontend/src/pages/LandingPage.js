import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <header>
        <h1>Welcome to Shiny Track!</h1>
        <p>Login or Signup to continue</p>
      </header>
      <Link to="/SignIn">
        <button type="button">press to login or signup</button>
      </Link>
      <Link to="/SignUp">
        <button type="button">Sign up!</button>
      </Link>
    </div>
  );
}

export default LandingPage;