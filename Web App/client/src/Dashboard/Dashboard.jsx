import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { DashboardAuth } from "../services/Auth-Service";
import { CreateUserForm, 
        AddQuestionForm, 
        CreateTestForm,
        CreateClassForm, 
        ViewUsers,
        ViewClasses, 
        ViewTest,
        ViewQuestions } from "../components/dashboard-components";
import "./style.css";
import { QueryClient, QueryClientProvider } from 'react-query';

export const Dashboard = () => {
  const queryClient = new QueryClient();
  const navigate = useNavigate();
  const [userAccess, setUserAccess] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  
  useEffect(() => {
    const id = sessionStorage.getItem('id');
    const role = sessionStorage.getItem('role');
    DashboardAuth(id, role)
    .then(result => {
      const resultRole = result;
        if (resultRole == 'superuser') {
          setUserAccess(true);
          setAdmin(true);
        } else if (resultRole == 'teacher') {
          setUserAccess(true);
        } else {
          navigate("/");
        }
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }, []);
 
  if (userAccess) {
    return (
      <div className="dashboard">
        <QueryClientProvider client={queryClient}>
        <div className="top-left">
          <div className="title display-6">{isAdmin? ("Users") : ("Students")}</div>
          <ViewUsers />
          <CreateUserForm />
        </div>
        <div className="top-right">
          <div className="title display-6">{isAdmin? ("Classes") : ("Manage Class")}</div>
          <ViewClasses />
          <CreateClassForm />
        </div>
        <div className="bottom-left">
          <div className="title display-6">{isAdmin? ("Tests") : ("Quiz Settings")}</div>
          <ViewTest setSelectedTest={setSelectedTest}/>
          <CreateTestForm />
        </div>  
        <div className="bottom-right">
          <div className="title display-6">
            {isAdmin ? (selectedTest ? `Questions for Test: ${selectedTest.id}` : "Questions") : "Statistics"}
          </div>
          <ViewQuestions selectedTest={selectedTest}/>
          <AddQuestionForm selectedTest={selectedTest}/>
        </div>  
        
        </QueryClientProvider>
      </div>
      
    );
  } else {
    // Return alternative content when userAccess is not true
    return (
      <div className="access-denied">
        <p>You don't have access to this content.</p>
        {/* TODO: provide a message or other content here */}
      </div>
    );
  }
};


