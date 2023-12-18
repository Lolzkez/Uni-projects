import axios from "axios";
const backendURL = "http://localhost:5000";
const addClass = async (class_no) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${backendURL}/class/create-class`, {
        class_no: class_no
      }, {
        headers: {
          'Authorization': `${token}`
        }
      })
      return "Class added",response.json;
    } catch(error) {
      console.log(error);
    }
};
  
const addUserToClass = async(userId, class_no) => {
    console.log(`Adding ${userId} to class ${class_no}`)
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(`${backendURL}/class/add-user`, {
            userId: userId,
            class_no: class_no
        }, {
        headers: {
            'Authorization': `${token}`
            }
        })
        return "User added to class",response.json;
    } catch(error) {
        console.log(error);
    }
};

const addTestToClass = async (testId, class_no) => {
    try{
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${backendURL}/class/add-test`, {
        testId: testId,
        class_no: class_no
      }, {
        headers: {
          'Authorization': `${token}`
        }
      })
      return "Added Test ",response.json;
    }
    catch(error) {
      console.log(error);
    }
};

const viewAllClasses = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`${backendURL}/class/view-classes`, {
        headers: {
          'Authorization': `${token}`
        }
      })
      return response.data;
    } catch(error) {
      console.log(error);
    }
};

const deleteClass = async(class_no) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(`${backendURL}/class/delete`, {
        data: { class_no: class_no },
        headers: {
          'Authorization': `${token}`
        }
      });
      return response.data;
    } catch(error) {
      console.log(error);
    }
};

export {addClass,addTestToClass,addUserToClass,viewAllClasses,deleteClass}