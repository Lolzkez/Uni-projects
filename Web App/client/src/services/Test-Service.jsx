import axios from "axios";
const backendURL = "http://localhost:5000";
const createTest = async (testId, date, duration) => {
    try {
      const token = sessionStorage.getItem('token');
      const id = sessionStorage.getItem('id');
      const response = await axios.post(`${backendURL}/test/create`, {
        id: id,
        date: date,
        testId: testId,
        duration: duration
      }, {
        headers: {
          'Authorization': `${token}`
        }
      })
      return "Added Test",response.json;
    } catch(error) {
      console.log(error);
    }
};

const addQuestion = async (type, questionDiff) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${backendURL}/question/create`, {
        difficulty: questionDiff,
        qType: type
      }, {
        headers: {
          'Authorization': `${token}`
        }
      })
      return response.data;
    } catch(error) {
      console.log(error);
    }
};

const addQuestionToTest = async (questionId, testId) => {
    try {
        const token = sessionStorage.getItem('token');
        const response = await axios.post(`${backendURL}/test/add-question`, {
            testId: testId,
            questionId: questionId
        }, {
        headers: {
            'Authorization': `${token}`
            }
        })
        return "Added Question To Quiz",response.json;
    } catch(error) {
        console.log(error);
    }
};

const viewAllTests = async () => {
    try {
      const response = await axios.get(`${backendURL}/test/tests`, {
        })
      return response.data;
    } catch(error) {
        console.log(error);
    }
};

const deleteTest = async(testId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(`${backendURL}/test/delete`, {
        data: { testId: testId },
        headers: {
          'Authorization': `${token}`
        }
      });
      return response.data;
    } catch(error) {
      console.log(error);
    }
};

const deleteQuestion= async(questionId,testId) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.delete(`${backendURL}/test/remove-question`, {
        data: { questionId: questionId, testId: testId },
        headers: {
          'Authorization': `${token}`
        }
      });
      return response.data;
    } catch(error) {
       console.log(error);
    }
  }

export { createTest,addQuestion,addQuestionToTest,viewAllTests,deleteTest,deleteQuestion}