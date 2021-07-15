// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Profession({ profession, expansions, sourceTypes }) {
  return (
    <>
      <section className="mb-5">
        <header className="border-bottom py-1 my-3">
          <h1>{profession.profession.name}</h1>
        </header>
        <article>
          {expansions.map((expansion) => {
            return (
              <Expansion
                key={expansion.expansion}
                profession={profession}
                expansion={expansion}
                sourceTypes={sourceTypes}
              />
            );
          })}
        </article>
      </section>
    </>
  );
}

function Expansion({ profession, expansion, sourceTypes }) {
  return (
    <>
      {expansion.expansion ? (
        <section id={expansion.expansion} className="mt-4 mb-4">
          <header>
            <h3 className="m-0">{expansion.expansion}</h3>
          </header>
          <article className="d-flex align-content-start flex-wrap">
            {sourceTypes.map((sourceType) => {
              return (
                <SourceType
                  key={sourceType.sourcetype}
                  profession={profession}
                  expansion={expansion}
                  sourceType={sourceType}
                />
              );
            })}
          </article>
        </section>
      ) : null}
    </>
  );
}

function SourceType({ profession, expansion, sourceType }) {
  const [recipes, setRecipes] = useState([]);

  const getRecipes = () => {
    Axios.get(
      "http://localhost:3001/recipes/" +
        profession.profession.name +
        "/" +
        expansion.expansion +
        "/" +
        sourceType.sourcetype
    ).then((response) => {
      setRecipes(response.data);
    });
  };
  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <>
      {recipes.length > 0 ? (
        <section className="row my-2">
          <header>
            <p className="text-capitalize mb-1">{sourceType.sourcetype}</p>
          </header>
          <article>
            {recipes.map((recipe) => {
              return (
                <a key={recipe.id} href={"https://www.wowhead.com/recipe/" + recipe.id}>
                  <img
                    id={recipe.id}
                    src={process.env.PUBLIC_URL + "/icons/" + recipe.icon + ".jpg"}
                    // src="https://picsum.photos/200"
                    className="rounded-3"
                    style={{ maxWidth: "35px" }}
                    alt={recipe.name}
                  ></img>
                </a>
              );
            })}
          </article>
        </section>
      ) : null}
    </>
  );
}

function Overview({ professions, expansions }) {
  return (
    <>
      <section>
        <header className="border-bottom py-1 my-3">
          <h1>Overview</h1>
        </header>
        <article>
          {professions.map((profession) => {
            return <Progress profession={profession} />;
          })}
        </article>
      </section>
    </>
  );
}

function Progress({ profession }) {
  return (
    <>
      <section className="mt-4 mb-4">
        <header>
          <h3>{profession.profession.name}</h3>
        </header>
        <article>
          <div className="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style={{ width: "25%" }}
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              25%
            </div>
          </div>
        </article>
      </section>
    </>
  );
}

function App() {
  const [profileRegion, setProfileRegion] = useState("us");
  const [profileRealm, setProfileRealm] = useState("kelthuzad");
  const [profileCharacterName, setProfileCharacterName] = useState("asmongold");
  const [profileProfessions, setProfileProfessions] = useState([]);

  const [expansions, setExpansions] = useState([]);
  const [sourceTypes, setSourceTypes] = useState([]);

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

  // Getting expansions from database
  const getExpansions = () => {
    Axios.get("http://localhost:3001/expansions/").then((response) => {
      setExpansions(response.data);
    });
  };

  // Getting sourcetypes from database
  const getSourceTypes = () => {
    Axios.get("http://localhost:3001/sourcetypes/").then((response) => {
      setSourceTypes(response.data);
    });
  };

  useEffect(() => {
    getExpansions();
    getSourceTypes();
  }, []);

  return (
    <Router>
      <div className="container">
        <nav className="nav nav-pills nav-justified">
          <Link className="nav-link" to="/overview">
            Overview
          </Link>
          {profileProfessions.map((profession) => {
            return (
              <Link key={profession.profession.id} className="nav-link" to={"/" + profession.profession.name}>
                {profession.profession.name}
              </Link>
            );
          })}
        </nav>

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

        <Switch>
          <Route
            exact
            path="/overview"
            render={() => <Overview professions={profileProfessions} expansions={expansions} />}
          />
          {profileProfessions.map((profession) => {
            return (
              <Route
                key={profession.profession.id}
                path={"/" + profession.profession.name}
                render={() => <Profession profession={profession} expansions={expansions} sourceTypes={sourceTypes} />}
              />
            );
          })}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
