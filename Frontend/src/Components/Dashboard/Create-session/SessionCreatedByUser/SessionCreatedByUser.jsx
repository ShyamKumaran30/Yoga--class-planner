import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import SequenceUI from '../../Sequence/SequenceUI';

const SessionCreatedByUser = () => {
  const [classes, setClasses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    benefits: '',
    addedByName: '',
    addedById: ''
  });
  const [sequences, setSequences] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/class/teacher-classes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchClasses();
  }, []);

  const handleDeleteClick = (classId) => {
    setClassToDelete(classId);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/class/delete-class/${classToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setClasses(classes.filter(classItem => classItem._id !== classToDelete));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };
  
  const handleEditClick = (classItem) => {
    setClassToEdit(classItem);
    setShowEditModal(true);
  };

  const handleEditConfirm = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/class/update-class/${classToEdit._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Update class in state
      const updatedClasses = classes.map(classItem => {
        if (classItem._id === classToEdit._id) {
          return { ...classItem, ...formData };
        }
        return classItem;
      });         
      setClasses(updatedClasses);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating class:', error);
    }
  };

  const handleFormsClick = async (studentId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/form/student-forms/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSelectedForm(response.data.forms[0]);
      setShowFormModal(true);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleOpenSequenceModal = (studentId) => { 
    setSelectedStudentId(studentId); 
    setShowSequenceModal(true);
  };

  const handleCloseSequenceModal = () => {
    setShowSequenceModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h1>Classes</h1>
      <div className="class-box-container">
        {classes.map((classItem) => (
          <div className="class-box" key={classItem._id}>
            <h2>{classItem.className}</h2>
            <p>Description: {classItem.description}</p>
            <p>Date: {new Date(classItem.date).toLocaleDateString()}</p>
            <p>Time: {classItem.time}</p>
            <p>Duration: {classItem.duration} minutes</p>
            <p>Max Capacity: {classItem.maxCapacity}</p>
            <p>Venue: {classItem.venue}</p>
            <Button variant="danger" onClick={() => handleDeleteClick(classItem._id)}>Delete</Button>{' '}
            <Button variant="primary" onClick={() => handleEditClick(classItem)}>Edit</Button>
            <h3>Students:</h3>
            <ul>
              {classItem.students.map((student) => (
                <li key={student.bookingId}>
                  {student.studentId && student.studentId.name} 
                  <button className='ml-3' onClick={() => handleFormsClick(student.studentId._id)}>Forms</button>{' '}
                  <button onClick={() => handleOpenSequenceModal(student.studentId._id)}>Suggest Sequence</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this class?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="className">
              <Form.Label>Class Name</Form.Label>
              <Form.Control type="text" name="className" value={formData.className} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Desription</Form.Label>
              <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="time">
              <Form.Label>time</Form.Label>
              <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control type="Date" name="date" value={formData.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="duration">
              <Form.Label>Date</Form.Label>
              <Form.Control type="text" name="duration" value={formData.duration} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleEditConfirm}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Student Forms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedForm ? (
            <div>
              <h3>General Health:</h3>
              <p>Existing Medical Conditions: {selectedForm.generalHealth && selectedForm.generalHealth.existingMedicalConditions}</p>
              <p>Medications: {selectedForm.generalHealth && selectedForm.generalHealth.medications}</p>
              <p>Surgeries or Injuries: {selectedForm.generalHealth && selectedForm.generalHealth.surgeriesOrInjuries}</p>
              <p>Allergies: {selectedForm.generalHealth && selectedForm.generalHealth.allergies}</p>
              <h3>Physical Health:</h3>
              <p>Chronic Pain: {selectedForm.physicalHealth && selectedForm.physicalHealth.chronicPain}</p>
              <p>Sensitive Areas: {selectedForm.physicalHealth && selectedForm.physicalHealth.sensitiveAreas}</p>
              <p>Physical Limitations: {selectedForm.physicalHealth && selectedForm.physicalHealth.physicalLimitations}</p>
              <h3>Yoga Experience:</h3>
              <p>Practiced Before: {selectedForm.yogaExperience && selectedForm.yogaExperience.practicedBefore}</p>
              <p>Yoga Styles: {selectedForm.yogaExperience && selectedForm.yogaExperience.yogaStyles}</p>
              <p>Goals: {selectedForm.yogaExperience && selectedForm.yogaExperience.goals}</p>
              <p>Avoid Poses: {selectedForm.yogaExperience && selectedForm.yogaExperience.avoidPoses}</p>
            </div>
          ) : (
            <p>No form selected</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSequenceModal} onHide={handleCloseSequenceModal}>
        <Modal.Header closeButton>
          <Modal.Title>Sequence Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SequenceUI studentId={selectedStudentId} /> 
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSequenceModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SessionCreatedByUser;
