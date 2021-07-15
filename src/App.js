// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  return (
    <div className="container">
      <div className="row m-3 justify-content-center">
        <div className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-7 col-8 p-2 d-grid gap-2">
          <div>
            <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Character"></input>
          </div>
          <div>
            <input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Realms"></input>
            <datalist id="datalistOptions">
              <option value="Kelthuzad"></option>
              <option value="Ravencrest"></option>
              <option value="Outland"></option>
              <option value="Tichondrious"></option>
              <option value="Chicago"></option>
            </datalist>
          </div>
          <button className="btn btn-primary" type="button">
            Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
