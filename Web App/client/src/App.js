import './App.css';
import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import { Dashboard } from './Dashboard/Dashboard';
import { Homepage } from './Homepage/Homepage';
import { Tests, Test } from './Tests/Tests';
import { LoginPage } from './LoginPage/LoginPage';
import { Corsi } from './components/question_render/Corsi';
import {DashboardResult, Result} from './Results/Results'
import {Navbar} from "./Navbar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <BrowserRouter basename='/'>
      <Navbar /> 
        <Switch>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/results" element={<DashboardResult />} />
          <Route path="/tests/:type" element={<Tests />} />
          <Route path="/test/:testId" element={<Test />} />
          <Route path="/test/:testId/results" element={<Result />}/>
          <Route path="/test/corsi" element={<Corsi />}/>
        </Switch>
    </BrowserRouter>
  );
}

export default App