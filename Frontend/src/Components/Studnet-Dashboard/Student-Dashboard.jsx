import StudentHeader from "./Header/Header";
import StudentHome from "./Home/Home";
import StudentClasses from "./StudentClassesJoined/Student-class";

const StudentDashboard = () => {
    return(
        <div>
            <div className="student-Header">
            <StudentHeader></StudentHeader>
            </div>
            <br></br>
            <div className="student-home">
                <StudentHome></StudentHome>
            </div>
            <div>
                <StudentClasses></StudentClasses>
            </div>
        </div>
    )
    };
    
    export default StudentDashboard;
    