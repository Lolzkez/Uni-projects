import axios from "axios";
const backendURL = "http://localhost:5000";
const viewClassTests = async() => {
  try {
    const token = sessionStorage.getItem('token');
    console.log(token)
    const response = await axios.get(`${backendURL}/class/tests`, {
      headers: {
        Authorization: `${token}`
        }
      })
    return response.data;
  } catch(error) {
      console.log(error);
  }
}

const postAnswer = async (testId, answers, totalCorrect, totalTimeTaken) => {
  const token = sessionStorage.getItem('token');
  try {const response = await axios.post(`${backendURL}/result/answer`, {
        testId: testId,
        studentAnswers: answers,
        totalCorrect: totalCorrect,
        totalTimeTaken: totalTimeTaken
      }, {
        headers: {
          Authorization: `${token}`
        }
      })
  if (response) { return response.data; }
  return null;
  } catch(error) {
     console.log(error);
  }
};

const postCorsi = async (longestStreak) => {
  const token = sessionStorage.getItem('token');
  try {const response = await axios.post(`${backendURL}/result/answer`, {
        
      }, {
        headers: {
          Authorization: `${token}`
        }
      })
  if (response) { return response.data; }
  return null;
  } catch(error) {
     console.log(error);
  }
};


export  {viewClassTests, postAnswer, postCorsi};