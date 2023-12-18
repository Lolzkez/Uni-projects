import axios from "axios";
const backendURL = "http://localhost:5000";
const Login = async (id,password) => {
    try {
        const response = await axios.post(`${backendURL}/login/`, {
          id: id,
          password: password,
        });
        console.log("Login successful:", response.data);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("id", response.data.id);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("class_no", response.data.class_no);
        console.log(response.data.firstLogin);
        return response.data;
      } catch (err) {
        console.error("Login error:", err);
      }
}

const DashboardAuth = async (id, role) => {
    const token = sessionStorage.getItem("token");
    try {
        const response = await axios.post(`${backendURL}/dashboard/${role}`, {
            id: id
        }, {
            headers: {
                'Authorization': `${token}`
            }
        });
        if (response.status === 201) {
            return role;
        } else {
            console.error(`Unexpected status code: ${response.status}`);
            return null; 
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;  
    }
};

const Logout = (navigate) => {
    sessionStorage.clear();
    navigate("/");
}

const ChangePassword = async(id,newpassword) => {
    const token = sessionStorage.getItem("token");
    console.log("NEW PW",newpassword);
    try {
        const response = await axios.post(`${backendURL}/login/change-password`, {
          id: id,
          newPassword: newpassword,
        },{
          headers: {
            'Authorization': `${token}`
        }
        });
        console.log("Password Changed:", response.data);
        return;
      } catch (err) {
        console.error("Login error:", err);
      }
}

export  {Login,DashboardAuth,Logout,ChangePassword};