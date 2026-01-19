import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './StudentHome.css';
import ContextMenu from './ContextMenu';
import Forms from '../Forms/Forms'; 
import ViewAsanas from "../../Dashboard/View-Asanas/ViewAsanas"

const StudentHome = () => {
  const [classesData, setClassesData] = useState([]);
  const [displayedClasses, setDisplayedClasses] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [contextMenuPos, setContextMenuPos] = useState({ xPos: 0, yPos: 0 });
  const [isContextMenuVisible, setContextMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showFormsModal, setShowFormsModal] = useState(false); 
  const [teacherNames, setTeacherNames] = useState({}); // State to store teacher names
  const classesPerPage = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://localhost:3001/api/class/get-classes', config);
        console.log('API Response:', response.data); 
        const sortedData = response.data
          .filter(classItem => new Date(classItem.date) >= new Date())
          .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
        setClassesData(sortedData);
        setDisplayedClasses(sortedData.slice(startIndex, startIndex + classesPerPage));

      
        const teacherIds = sortedData.map(item => item.teacher);
        const namesPromises = teacherIds.map(teacherId =>
          axios.get(`http://localhost:3001/api/teacher/${teacherId}`, config)
        );
        const namesResponses = await Promise.all(namesPromises);
        const teacherNamesMap = {};
        namesResponses.forEach((response, index) => {
          const teacherName = response.data.name;
          teacherNamesMap[teacherIds[index]] = teacherName;
        });
        setTeacherNames(teacherNamesMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [startIndex]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPos({ xPos: e.clientX, yPos: e.clientY });
    setContextMenuVisible(true);
  };

  const handleCloseContextMenu = () => {
    setContextMenuVisible(false);
  };

  const loadMoreClasses = () => {
    const newIndex = startIndex + classesPerPage;
    setDisplayedClasses([...displayedClasses, ...classesData.slice(newIndex, newIndex + classesPerPage)]);
    setStartIndex(newIndex);
  };

  const bookSession = async (classId) => {
    try {
      const token = sessionStorage.getItem('token'); 
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(`http://localhost:3001/api/class/join-class/${classId}`, null, config);
      setSuccessMessage('Class booked successfully.');
      setErrorMessage(''); 
      console.log('Success:', response.data);
     
    } catch (error) {
      setSuccessMessage(''); 
      // Fetch the error message and display that 
      const errorMsg = error.response?.data?.message || 'Error booking class. Please try again.';
      setErrorMessage(errorMsg);
      console.error('Error:', error); 
    }
  };

  return (
    <div className="student-home col-12">
      <div className="view-asanas">
        <ViewAsanas></ViewAsanas>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message" style={{color:"red",fontSize:"20px"}}>{errorMessage}</div>}
      <h1>Classes that are available</h1>
      <div className="class-box-container">
        {displayedClasses.map((classItem) => {
          console.log('Class ID:', classItem._id); 
          return (
            <div className="class-box" key={classItem.id} onContextMenu={handleContextMenu}>
              <h2>{classItem.className}</h2>
              <p>{classItem.description}</p>
              <p>Date: {new Date(classItem.date).toLocaleDateString()}</p>
              <p>Time: {classItem.time}</p>
              <p>Teacher: {classItem.teacher.name}</p> 
              <p>Available Capacity: {classItem.maxCapacity - (classItem.students ? classItem.students.length : 0)}</p>
              <p>Venue:{classItem.venue}</p>
      
              <br></br>
              <button className="button" onClick={() => bookSession(classItem._id)}>Book session</button>
            </div>
          );
        })} 
      </div>
      <button onClick={loadMoreClasses} className="button col-12" style={{ width: '400px', justifyContent: 'center', alignItems: 'center' }}>
        Load More
      </button>
      <Modal show={showFormsModal} onHide={() => setShowFormsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Forms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Forms />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentHome;
