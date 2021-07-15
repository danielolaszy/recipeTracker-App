// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [profileRegion, setProfileRegion] = useState("us");
  const [profileRealm, setProfileRealm] = useState("kelthuzad");
  const [profileCharacterName, setProfileCharacterName] = useState("asmongold");
  const [profileProfessions, setProfileProfessions] = useState([]);

  // creating baseURL for axios
  const blizzApi = Axios.create({
    baseURL: "https://" + profileRegion + ".api.blizzard.com/",
    headers: {
      // "Battlenet-Namespace": "profile-" + profileRegion,
      "Authorization": "Bearer " + process.env.REACT_APP_ACCESS_TOKEN,
    },
  });

  // Getting professions for character input in the fields
  const getProfileProfessions = () => {
    blizzApi
      .get(
        "/profile/wow/character/" +
          profileRealm +
          "/" +
          profileCharacterName +
          "/professions?namespace=profile-us&locale=en_US"
      )
      .then((response) => {
        console.log("Fetching professions for " + profileCharacterName + " on " + profileRealm + " " + profileRegion);
        setProfileProfessions(response.data.primaries);
        setProfileProfessions((profileProfessions) => [...profileProfessions, ...response.data.secondaries]);
        profileProfessions.forEach((profession) => console.log("Found " + profession.profession.name + "!"));
      });
  };

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
          <button className="btn btn-primary" type="button" onClick={getProfileProfessions}>
            Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
