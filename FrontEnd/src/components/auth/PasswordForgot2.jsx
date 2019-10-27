import React from 'react';
import './Sign.css'
import logo from '../../assets/Logo_invert.png'
import { ReactComponent as EmailSVG } from '../../assets/email.svg';

const Dashboard = () => {
  return (
    <div className='wrapper'>
      <img className='signin-logo' src={logo} alt='logo' />
      <div style={{ margin: '30px auto', display: 'flex', justifyContent: 'center' }}><EmailSVG /></div>
      <p className='top-text-first'>We have sent an email to the account with the email</p>
      <p className='top-text-third'>Please check your email history to ensure that this is the email you used when registering </p>
      <p className='top-text-fourth'>with Funnelsmap. If so, you should receive a password-reset email shortly.</p>
    </div>
  );
}

export default Dashboard;