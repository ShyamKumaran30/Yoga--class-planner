import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Forms from '../Forms/Forms';

const StudentHeader = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showFormsModal, setShowFormsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearchChange = async (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/asana/view-asanas?search=${searchTerm}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const logout = () => {
    // Remove JWT token from session storage
    sessionStorage.removeItem('token');
    // Navigate to login page
    navigate('/');
  };

  const toggleFormsModal = () => {
    setShowFormsModal(!showFormsModal);
  };

  return (
    <div className="student-header">
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <a className="navbar-brand" href="#" style={{ color: 'black' }}>
          Yoga Planner
        </a>
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

        <div
          className={`collapse navbar-collapse ${
            dropdownOpen ? 'show' : ''
          }`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ml-auto py-4 py-md-0">
            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
              <a
                className="nav-link"
                href="#"
                onClick={toggleFormsModal}
                data-toggle="modal"
                data-target="#formsModal"
              >
                Forms
              </a>
            </li>
            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4">
              <a className="nav-link" href="/sugesstion">
                Notification
              </a>
            </li>

            <li className="nav-item pl-4 pl-md-0 ml-0 ml-md-4 dropdown">
              <div className="btn-group">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  onClick={toggleDropdown}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <span className="col-5">
                    {user ? capitalizeFirstLetter(user) : 'Profile'}
                  </span>
                </a>
                <div
                  className={`dropdown-menu col-5  ${
                    dropdownOpen ? 'show' : ''
                  }`}
                >
                  <a href="/student-settings" className="col-5">
                    Settings
                  </a>
                  <div className="div col-12">
                  <button onClick={logout}>Logout</button> {/* Logout button */}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <div className="search-results">
        <ul>
          {searchResults.map((result) => (
            <li key={result.id}>
              {result.name}
            </li>
          ))}
        </ul>
      </div>
      <div className={`modal fade ${showFormsModal ? 'show' : ''}`} id="formsModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Forms</h5>
              <button type="button" className="close" onClick={toggleFormsModal} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Forms />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;
