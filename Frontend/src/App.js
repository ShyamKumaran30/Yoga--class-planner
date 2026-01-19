
import './App.css';

import TeacherSignupComponent from './Components/Authentications/Teacher/SignupComponent/Teacher-Signup.jsx'
import LoginCompoenent from './Components/Authentications/Teacher/LoginComponent/Teacher-Login.jsx';
  import StudentSignupComponent from './Components/Authentications/student/SignupComponent/Student-Signup.jsx';
  import StudentLoginComponent from './Components/Authentications/student/LoginComponent/Student-Login.jsx';
import { BrowserRouter as  Router, Routes,Route } from 'react-router-dom';
import RedirectComponent from './Components/Authentications/Redirect/Redirect.jsx';
import DashboardComponent from './Components/Dashboard/Dashboard.jsx';
import StudentDashboard from './Components/Studnet-Dashboard/Student-Dashboard.jsx';
import TeacherSettings from './Components/Dashboard/TeacherSetting/Teacher-setting.jsx';
import AsanasAddedByUser from './Components/Dashboard/AsasnsAddedByUser/AsanasAddedByUser.jsx';
import ViewAsanas from './Components/Dashboard/View-Asanas/ViewAsanas.jsx';
import CreateClassSession from './Components/Dashboard/Create-session/Create-session.jsx';
import ViewAsanasinTeacher from './Components/Dashboard/ViewAsanasinTeacher/ViewAsanasinteacher.jsx';
import Forms from './Components/Studnet-Dashboard/Forms/Forms.jsx';
import AdminDashboard from './Components/Admin/AdminDashboard.jsx';
import StudentSequence from './Components/Studnet-Dashboard/StudentClassesJoined/SrudentForms.jsx';
import StudentSettings from './Components/Studnet-Dashboard/Header/StudentSettings.jsx';
import ForgotPassword from './Components/Authentications/student/LoginComponent/Forgot-Password';
import ResetPassword from './Components/Authentications/student/LoginComponent/Reset-Password';
import TeacherForgotPassword from './Components/Authentications/Teacher/LoginComponent/Forgot-Password';
import TeacherResetPassword from './Components/Authentications/Teacher/LoginComponent/Reset-Password';
import AdminLogin from './Components/Admin/AdminStudent/AdminLogin.jsx';

function App() {
  return (
    <div>
    <Router>
      <Routes>
      <Route path="/" element = { <RedirectComponent></RedirectComponent>}></Route>
      <Route path="/teacher-signup" element = {<TeacherSignupComponent></TeacherSignupComponent>}> </Route>
      <Route path='/teacher-login' element ={<LoginCompoenent></LoginCompoenent>}></Route>
      <Route path='/teacher/forgot-password' element={<TeacherForgotPassword></TeacherForgotPassword>} ></Route>
      <Route path='/teacher/reset-password/:token' element = {<TeacherResetPassword></TeacherResetPassword>}></Route>
      <Route path='/student-signup' element = {<StudentSignupComponent></StudentSignupComponent>}></Route>
      <Route path='/student-login' element = {<StudentLoginComponent></StudentLoginComponent>}></Route>
      <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>} ></Route>
      <Route path='/student/reset-password/:token' element = {<ResetPassword></ResetPassword>}></Route>
      <Route path='/dashboard' element={<DashboardComponent></DashboardComponent>} ></Route>
      <Route path='/student-dashboard' element={<StudentDashboard></StudentDashboard>}></Route>
      <Route path='/teacher-settings' element={<TeacherSettings></TeacherSettings>}></Route>
      <Route path='/asanasAddedByUser' element={ <AsanasAddedByUser></AsanasAddedByUser>}></Route>
      <Route path='/Viewasanas' element={<ViewAsanasinTeacher></ViewAsanasinTeacher>}></Route>
      <Route path='/viewAsanas' element={<ViewAsanas id="view-asanas" />
}></Route>
<Route path='/forms' element={<Forms></Forms>}></Route>
<Route path='/createClssSession' element={<CreateClassSession id="create-session" />
}></Route>
<Route path='/student-settings' element={<StudentSettings></StudentSettings>}></Route>
<Route path='/AdminDashboard' element={<AdminDashboard></AdminDashboard>}></Route>
<Route path='/adminLogin' element={<AdminLogin></AdminLogin>}></Route>
<Route path='/sugesstion' element={<StudentSequence></StudentSequence>}></Route>

                  </Routes>

    </Router>
    </div>  
  );
  
}

export default App;
