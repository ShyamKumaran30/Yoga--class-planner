import React from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import AdminStudent from './AdminStudent/AdminStudent';
import AdminTeacher from './AdminStudent/AdminTeacher';
import AsanaList from './AdminAsanas';

const AdminDashboard = () => {
  return (
    <div className="admin-container col-12 mt-4">
      <Tabs defaultActiveKey="students" id="admin-dashboard-tabs">
        <Tab eventKey="students" title="Students">
          <div className="student-register">
            <AdminStudent />
          </div>
        </Tab>
        <Tab eventKey="teachers" title="Teachers">
          <div className="teacher-register">
            <AdminTeacher />
          </div>
        </Tab>
        <Tab eventKey="Asanas" title="Asanas">
          <div className="Asanas">
            <AsanaList></AsanaList>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
