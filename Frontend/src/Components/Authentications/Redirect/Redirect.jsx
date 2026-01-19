import React from 'react';
import './Redirect.css';
import styles from './Redirect.css'; 

const Redirect = () => {
  return (

    <div className="container col-12">
     <div className="side-a col-6 row">
      <div className="box">
      <a href="/teacher-login">Login as Teacher</a>
      </div>
  
      <div className="box">
        <a href='/student-login'>Login as Student</a>
      </div>
    </div>
    <div className="side-b col-6">
        <div className="text-area">
        <h1>Welcome! to &nbsp;</h1>
        <h1> Zenflow Yoga</h1>
        </div>
    </div>
    </div>
 
  );
};

export default Redirect;
