import axios from "axios";
const backendURL = "http://localhost:5000";
const createUser = async (newId, role) => {
  try {
    const token = sessionStorage.getItem('token');
    const id = sessionStorage.getItem('id');
    const response = await axios.post(`${backendURL}/dashboard/create-user`, {
      id: id,
      newId: newId,
      role: role
    }, {
      headers: {
        'Authorization': `${token}`
      }
    })
    return "SERVICE",response.json;
  } catch(error) {
    console.log(error);
  }
};

const viewUsers = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`${backendURL}/dashboard/view-users`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    return response.data;
  } catch(error) {
    console.log(error);
  }
}

const viewAllResults = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.get(`${backendURL}/result/all`, {
      headers: {
        'Authorization': `${token}`
      }
    })
    console.log(response.data)
    return response.data;
  } catch(error) {
    console.log(error);
  }
}

const deleteUser = async(userId) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.delete(`${backendURL}/dashboard/user/delete`, {
      data: { userId: userId },
      headers: {
        'Authorization': `${token}`
      }
    });
    return response.data;
  } catch(error) {
    console.log(error);
  }
}

export  { createUser,
          viewUsers,
          viewAllResults,
          deleteUser
          };