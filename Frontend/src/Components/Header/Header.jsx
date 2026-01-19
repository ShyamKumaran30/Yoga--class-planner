import React from 'react';
import './Header.css'; // Make sure the path is correct based on your project structure
 import Logo from '../../assests/Logo.png'
const Header = () => {
  return (
     <div className="header">

        <img src={Logo} alt="" className='logo' />

        <ul className='header-menu'>
        <li><a href="/Home">Home</a></li>
          <li><a href="/health-questionnaire">Health Questionnaire</a></li>
          <li><a href="/Courses">Courses</a></li>
          <li><a href="/Feedback&Rating">Feedback&Rating</a></li>
          <li><a href="/About us"> About us</a></li>
        </ul>
     </div>
  );
};
export default Header;