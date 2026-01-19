import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'; 
import Button from 'react-bootstrap/Button';

const AdminTeacher = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
    experience: ''
  });

  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 
  const [currentTeacherId, setCurrentTeacherId] = useState(null); 

  useEffect(() => {
    fetchAllTeachers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/admin/all-teachers');
      setTeachers(response.data);
    } catch (error) {
      setError('Error fetching teachers: ' + error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/api/admin/teacher/register', formData);
      alert('Teacher registered successfully');
      fetchAllTeachers(); 
    } catch (error) {
      setError('Error registering teacher: ' + error.response.data.message);
    }
  };

  const handleUpdate = (teacherId, teacherData) => {
    setCurrentTeacherId(teacherId);
    setFormData(teacherData);
    setShowEditModal(true);
  };

  const handleEditConfirm = async () => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.put(`http://localhost:3001/api/admin/teacher/update/${currentTeacherId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Teacher updated successfully');
      setShowEditModal(false);
      fetchAllTeachers(); 
    } catch (error) {
      setError('Error updating teacher: ' + error.response.data.message);
    }
  };

  const handleDelete = async (teacherId) => {
    try {
      await axios.delete('http://localhost:3001/api/admin/teacher/delete-profile', {
        data: { TeacherId: teacherId },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Teacher profile deleted successfully');
      fetchAllTeachers(); 
    } catch (error) {
      setError('Error deleting teacher profile: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Admin Teacher Management</h2>
      <label>Name:</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} /><br />
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} /><br />
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} /><br />
      <label>Birth Date:</label>
      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} /><br />

      <button onClick={handleRegister}>Register Teacher</button>
      
      <h2>All Teachers</h2>
      <ul>
        {teachers.map((teacher) => (
          <li key={teacher._id}>
            <div>Name: {teacher.name}</div>
            <div>Email: {teacher.email}</div>
            <div>Birth Date: {teacher.birthDate}</div>

            <button onClick={() => handleDelete(teacher._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <label>Birth Date:</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditConfirm}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTeacher;
