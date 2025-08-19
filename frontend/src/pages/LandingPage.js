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
        <button type="button">press to log in or sign up</button>
      </Link>
    </div>
  );
}

export default LandingPage;