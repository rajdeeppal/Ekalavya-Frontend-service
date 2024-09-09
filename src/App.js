import React from "react";
import TaskIframe from "./Components/Admin/TaskIframe";
import MainApp from "./Components/PM/MainApp";
import ProgressIframe from "./Components/PM/ProgressIframe";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<TaskIframe/>}/>
      <Route path='/beneficiary' element={<MainApp/>}/>
      <Route path='/inprogress' element={<ProgressIframe/>}/>
    </Routes>
  );
}

export default App;
