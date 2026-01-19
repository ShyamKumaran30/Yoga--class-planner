import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Header.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    console.log('Stored User:', storedUser); 
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const smoothScroll = (id) => {
    const yOffset = -50; // Adjust this value if needed
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleProfileUpdate = (updatedName) => {
    setUser(updatedName);
  };

  const handleLogout = () => {
    // Clear JWT token from session storage
    sessionStorage.removeItem('token');
    // Navigate to teacher signup page
    navigate('/');
  };

  return (
    <div className={`header ${isHeaderFixed ? 'fixed-header' : ''}`}>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <a className="navbar-brand col-2" href="#" style={{color:"black"}}>Yoga Planner</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse" 
          data-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          onClick={toggleDropdown} 
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className={`collapse navbar-collapse ${dropdownOpen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto py-4 py-md-0">
            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
              <a className="nav-link" href="/dashboard" >Home</a>
            </li>
            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
              <a className="nav-link" href="/Viewasanas">View Asanas</a>
            </li>
  
            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
              <a className="nav-link" href="/createClssSession">Sessions</a>
            </li>
            

            <div className="btn-group">
              <a 
                className="nav-link dropdown-toggle" 
                href="javascript:void(0)" 
                role="button" 
                onClick={toggleDropdown}
                aria-haspopup="true" 
                aria-expanded={dropdownOpen}
              >
                <span className='col-5'>{user ? capitalizeFirstLetter(user) : 'Profile'}</span>
              </a>
              <div className={`dropdown-menu col-5  ${dropdownOpen ? 'show' : ''}`}>
               <ul>
                <li>
                <a href='/teacher-settings' className='col-5'>Profile</a>
                </li>
                <li>
                <button onClick={handleLogout}  style={{background:"black", color :"white"}}>Logout</button>
                </li>
                </ul>
              </div>
            </div>
            
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
