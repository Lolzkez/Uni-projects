import "../Dashboard/style.css";
import { useQuery } from 'react-query';
import React, { useState,useEffect, useRef } from "react";

import { addClass,addTestToClass,addUserToClass,viewAllClasses,deleteClass } from "../services/Class-Service";
import { createUser,viewUsers,deleteUser } from "../services/Dashboard-Service";
import { createTest,addQuestion,addQuestionToTest,viewAllTests,deleteTest,deleteQuestion } from "../services/Test-Service";


const CreateUserForm = () => {
  const idRef = useRef(null);
  const roleRef = useRef(null);

  function addSubmit(e) {
    e.preventDefault();
    const role = roleRef.current.value;
    const newId = idRef.current.value;
    createUser(newId,role);
  }

  return (
    <form onSubmit={addSubmit} className="start-1 p-3 bg-light rounded addUser">
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="User ID" ref={idRef} />
        <select className="form-select" ref={roleRef}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </div>
    </form>
  )
};

const CreateTestForm = () => {
    const testIdRef = useRef(null);
    const durationRef = useRef(null);
    function addSubmit(e) {
        e.preventDefault();
        const testId = testIdRef.current.value;
        const duration = durationRef.current.value;
        createTest(testId, new Date(),duration);
    }
    return (
      <form onSubmit={addSubmit} className="position-absolute start-1 bottom-0 p-3 bg-light rounded addQuiz">
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Test ID" ref={testIdRef} />
          <input type="text" className="form-control" placeholder="Duration(s)" ref={durationRef} />
          <button type="submit" className="btn btn-primary">Create Test</button>
      </div>
    </form>
    );
};

const CreateClassForm = () => {
  const classIdRef = useRef(null);
  const teacherIdRef = useRef(null);
  
  function addClasses(e) {
    e.preventDefault();
    const classId = classIdRef.current.value;
    const teacherId = teacherIdRef.current.value;
    addClass(classId, teacherId);
  }
  
  return (
    <form className="start-1 p-3 bg-light rounded addClass">
      <div className="mb-3">
        <input type="text" className="form-control" placeholder="Class number" ref={classIdRef} />
        <input type="text" className="form-control" placeholder="Teacher ID" ref={teacherIdRef} />
        <button type="button" onClick={addClasses} className="btn btn-primary">Create Class</button>
      </div>
    </form>
  );
};

const AddQuestionForm = ({selectedTest}) => {
    const questionDiffRef = useRef(null);
    const typeRef = useRef(null);

    function submitQuestionToTest() {
      const questionDiff = questionDiffRef.current.value;
      const type = typeRef.current.value;
      addQuestion(type, questionDiff)
          .then(response => {
              console.log(`Adding qID:${response._id} to tID: ${selectedTest.id}`);
              addQuestionToTest(response._id, selectedTest.id);
          })
          .catch(error => {
              console.error("An error occurred:", error);
          });
    }

    return (
      <form className="position-absolute start-1 bottom-0 p-3 bg-light rounded addQuestion">
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Difficulty" ref={questionDiffRef} />
          <select className="form-select" ref={typeRef}>
            <option value="Hamster">Hamster Maze</option>
            <option value="Line">Line</option>
            <option value="DOT">DOT</option>
            <option value="Corsi">Corsi</option>
          </select>
          <button type="button" onClick={submitQuestionToTest} className="btn btn-primary">Add Question</button>
        </div>
      </form>
    
    );
};

const ViewTest = ({setSelectedTest}) => {
  const [tests, setTest] = useState([]);
  
  useEffect(() => {
    viewAllTests().then(response => {
      setTest(response.tests);
    })})

  const handleTestClick = (testId) => {
    setSelectedTest(testId);
  };

  const handleDeleteClick = (testId) => {
    deleteTest(testId);
  };

  return (
    <div className="test-list overflow-auto">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 2fr 2fr 0.5fr', gap: '5px' }}>
        <div>Test ID</div>
        <div>Questions</div>
        <div>Date</div>
        <div>Duration</div>
        <div></div>
      </div>
      <ul className="list-group list-test">
        {tests.map(test => (
          <li className="list-group-item" key={test._id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 2fr 0.5fr', gap: '5px' }}>
              <button className="badge bg-primary text-center" onClick={() => handleTestClick(test)}> {test.id || 'N/A'} </button>
              <div className="badge bg-secondary text-center" > {test.questions.length} </div>
              <div className="badge bg-secondary text-center" > {test.date || 'N/A'} </div>
              <div className="badge bg-secondary text-center" > {test.duration || 'N/A'} </div>
              <button className="badge bg-danger" onClick={() => handleDeleteClick(test.id)}> X </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ViewUsers = () => {
  const { data, isLoading, isError, refetch } = useQuery('users', viewUsers);

  const handleDeleteClick = async (userId) => {
    console.log(`Delete user with id: ${userId}`);
    await deleteUser(userId);
    refetch(); 
  };

  if (isLoading) return 'Loading...';
  if (isError) return 'An error occurred';

  return (
    <div className="users-list overflow-auto">
      <div className="header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 0.5fr', gap: '5px' }}>
        <span className="text-center">ID</span>
        <span className="text-center">Role</span>
        <span className="text-center">Class</span>
        <span></span>
      </div>
      <ul className="list-group listUsers">
        {data.map(user => (
          <li className="list-group-item" key={user._id}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr 0.5fr', gap: '5px' }}>
              <span className="badge bg-primary text-center">{user.id}</span>
              <span className={`badge text-center bg-${user.role}`} >{user.role}</span>
              <span className="badge bg-secondary text-center">{user.class_no ? user.class_no.class_no : 'N/A'}</span>
              <button className="badge bg-danger text-center"onClick={() => handleDeleteClick(user.id)}> X </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ViewQuestions = ({selectedTest}) => {
  const handleDeleteClick = async (questionId) => {
    console.log(`Delete question from ${selectedTest.id} with id: ${questionId}`);
    await deleteQuestion(questionId,selectedTest.id);
  };

  return (
      <div className="question-list overflow-auto">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 3fr 1fr', gap: '10px' }}>
          <div className="text-center">#</div>
          <div className="text-center">Type</div>
          <div className="text-center">Difficulty</div>
          <div className="text-center"></div>
        </div>
        <ul className="list-group list-question">
          {selectedTest?.questions.map((question, index) => (
            <li className="list-group-item" key={question._id}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 3fr 1fr', gap: '10px' }}>
                <div className="badge bg-primary text-center">{index+1}</div>
                <div className="badge bg-secondary text-center">{question.type}</div>
                <div className="badge bg-secondary text-center">{question.difficulty}</div>
                <div>
                  <button className="badge bg-danger text-center" onClick={() => handleDeleteClick(question._id)}>X</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
  );
}

const ViewClasses = () => {
  const { data: classesList, isLoading, isError, refetch } = useQuery('classes', viewAllClasses);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const testIdRef = useRef(null);
  const userIdRef = useRef(null);

  const handleDeleteClick = async (class_no) => {
    console.log(`Delete class with id: ${class_no}`);
    await deleteClass(class_no);
    refetch();  
  };
  const handleEditClick = (classes) => {
    console.log(classes)
    setSelectedClass(classes); 
    setShowModal(true);
  };
  const handleAddUser = (class_no) => {
    const userId = userIdRef.current.value;
    addUserToClass(userId, class_no);
  }
  const handleAddTest = (class_no) => {
    const testId = testIdRef.current.value;
    addTestToClass(testId, class_no);
  }

  if (isLoading) return 'Loading...';
  if (isError) return 'An error occurred';

  return (
    <div className="class-list overflow-auto">
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 0.5fr', gap: '5px' }}>
        <div>Class</div>
        <div>Teacher</div>
        <div>Tests</div>
        <div>Students</div>
        <div></div>
      </div>
      <ul className="list-group">
        {classesList.classes.map(classes => (
          <li className="list-group-item" key={classes._id}>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 0.5fr', gap: '5px' }}>
              <button className="badge bg-primary" onClick={() => handleEditClick(classes)}> {classes.class_no} </button>
              <div className="badge bg-secondary"> {classes.teacher ? classes.teacher.id : 'N/A'} </div>
              <div className="badge bg-secondary"> {classes.tests ? classes.tests.length : '0'} </div>
              <div className="badge bg-secondary"> {classes.students ? classes.students.length : '0'} </div>
              <button className="badge bg-danger text-center" onClick={() => handleDeleteClick(classes.class_no)}> X </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Class Number: {selectedClass.class_no}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Teacher: {selectedClass.teacher ? selectedClass.teacher.id : 'N/A'}</h6>
                </div>
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="students-tab" data-bs-toggle="tab" data-bs-target="#students" type="button" role="tab" aria-controls="students" aria-selected="true">Students</button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="tests-tab" data-bs-toggle="tab" data-bs-target="#tests" type="button" role="tab" aria-controls="tests" aria-selected="false">Tests</button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabsContent">
                  <div className="tab-pane fade show active" id="students" role="tabpanel" aria-labelledby="students-tab">
                    <div className="overflow-auto"> 
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr ', gap: '5px' }}>
                        <span className="text-center">Student ID</span>
                        <span></span>
                      </div>
                      {selectedClass.students.map((student) => ( 
                        <li className="list-group-item" key={student._id}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr ', gap: '5px' }}> 
                            <div className="badge bg-primary text-center"> {student.id} </div> 
                            <button className="badge bg-danger text-center"> X </button>
                          </div>
                        </li>
                      ))}
                    </div>
                    <div className="mb-3 mt-3">
                      <input type="text" className="form-control" placeholder="User ID" ref={userIdRef} />
                      <button type="button" onClick={() => handleAddUser(selectedClass.class_no)} className="btn btn-primary">Add Student</button>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tests" role="tabpanel" aria-labelledby="tests-tab">
                    <div className="overflow-auto"> 
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr ', gap: '5px' }}>
                          <span className="text-center">Test ID</span>
                          <span></span>
                        </div>
                        {selectedClass.tests.map((test) => ( 
                          <li className="list-group-item" key={test._id}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr ', gap: '5px' }}> 
                              <div className="badge bg-primary text-center"> {test.id} </div> 
                              <button className="badge bg-danger text-center"> X </button>
                            </div>
                          </li>
                        ))}
                      </div>
                    <div className="mb-3 mt-3">
                      <input type="text" className="form-control" placeholder="Test ID" ref={testIdRef} />
                      <button type="button" onClick={() => handleAddTest(selectedClass.class_no)} className="btn btn-primary">Add Test</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
};

export {CreateUserForm, 
        CreateClassForm,
        CreateTestForm,
        AddQuestionForm, 
        ViewUsers, 
        ViewTest, 
        ViewQuestions,
        ViewClasses
      };