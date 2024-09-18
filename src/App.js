import React from "react";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import MainApp from "./Components/PM/MainApp";
import ProgressIframe from "./Components/PM/ProgressIframe";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<AdminDashboard/>}/>
      <Route path='/beneficiary' element={<MainApp/>}/>
      <Route path='/inprogress' element={<ProgressIframe/>}/>
    </Routes>
  );
}

export default App;
