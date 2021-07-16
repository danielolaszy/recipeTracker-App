// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";

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
  const [recipeIds, setRecipeIds] = useState([]);

  useEffect(() => {
    const knownRecipes = profession.tiers.map((tier) => tier.known_recipes.map((recipe) => recipe.id));
  }, []);
  return (
    <>
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
    </>
  );
}

function SourceType({ profession, expansion, sourceType }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRecipes = () => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <>
      <PushSpinner size={100} color="#686769" loading={isLoading} />
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
            return <Progress key={profession.profession.name} profession={profession} />;
          })}
        </article>
      </section>
    </>
  );
}

function Progress({ profession }) {
  const [maxSkillPoints, setMaxSkillPoints] = useState([]);
  const [skillPoints, setSkillPoints] = useState([]);

  const calcMaxSkillPoints = () => {
    if (profession.tiers != null) {
      const maxSkillPointsArray = profession.tiers.map((tier) => tier.max_skill_points);
      const maxSkillPointsArraySum = maxSkillPointsArray.reduce((total, amount) => total + amount);
      setMaxSkillPoints(maxSkillPointsArraySum);
    }
  };

  const calcSkillPoints = () => {
    if (profession.tiers != null) {
      const skillPointsArray = profession.tiers.map((tier) => tier.skill_points);
      const skillPointsArraySum = skillPointsArray.reduce((total, amount) => total + amount);
      setSkillPoints(skillPointsArraySum);
    }
  };

  const calcPercentage = () => {
    if ((profession.id = 794)) {
      const percentage = (skillPoints / maxSkillPoints) * 100 + "%";
      return percentage;
    }
  };

  useEffect(() => {
    calcMaxSkillPoints();
    calcSkillPoints();
    calcPercentage();
  }, []);
  return (
    <>
      <section className="mt-4 mb-4">
        <header>
          <Link className="text-decoration-none" to={"/" + profession.profession.name}>
            <h3>{profession.profession.name}</h3>
          </Link>
        </header>
        <article>
          <Link to={"/" + profession.profession.name}>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: calcPercentage() }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {skillPoints + "/" + maxSkillPoints}
              </div>
            </div>
          </Link>
        </article>
      </section>
    </>
  );
}

function App() {
  const [profileRegion, setProfileRegion] = useState("US");
  const [profileRealm, setProfileRealm] = useState("Kel'Thuzad");
  const [profileCharacterName, setProfileCharacterName] = useState("asmongold");
  const [profileProfessions, setProfileProfessions] = useState([]);

  const [realms, setRealms] = useState([]);
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

  // const searching = () => {
  //   const realmFind = realms.find((realm) => realm.name == profileRealm && realm.region == profileRegion);
  // };

  // Getting professions for character input in the fields
  const getProfileProfessions = () => {
    try {
      const realmFind = realms.find((realm) => realm.name == profileRealm && realm.region == profileRegion);
      blizzApi
        .get(
          "/profile/wow/character/" +
            realmFind.slug +
            "/" +
            profileCharacterName +
            "/professions?namespace=profile-" +
            profileRegion +
            "&locale=en_US"
        )
        .then((response) => {
          console.log("Fetching professions for " + profileCharacterName + " on " + profileRealm + " " + profileRegion);
          setProfileProfessions(response.data.primaries);
          setProfileProfessions((profileProfessions) => [...profileProfessions, ...response.data.secondaries]);
          // profileProfessions.forEach((profession) => console.log("Found " + profession.profession.name + "!"));
        });
    } catch (err) {
      console.error("Failed to query blizzard api for character profile:\n" + err);
    }
  };

  // Getting realms from database
  const getRealms = () => {
    try {
      Axios.get("http://localhost:3001/realms/").then((response) => {
        setRealms(response.data);
      });
    } catch (err) {
      console.error("Failed to get realms from database: " + err);
    }
  };

  // Getting expansions from database
  const getExpansions = () => {
    try {
      Axios.get("http://localhost:3001/expansions/").then((response) => {
        setExpansions(response.data);
      });
    } catch (err) {
      console.error("Failed to get expansions from database: " + err);
    }
  };

  // Getting sourcetypes from database
  const getSourceTypes = () => {
    try {
      Axios.get("http://localhost:3001/sourcetypes/").then((response) => {
        setSourceTypes(response.data);
      });
    } catch (err) {
      console.error("Failed to get sourcetypes from database: " + err);
    }
  };

  const handleCharacter = (e) => {
    e.preventDefault();
    setProfileCharacterName(e.target.value.toLowerCase());
  };

  const handleRealm = (e) => {
    e.preventDefault();
    setProfileRegion(e.target.value.slice(0, 2).toLowerCase());
    setProfileRealm(e.target.value.slice(3, 255).toLowerCase());
  };

  useEffect(() => {
    getRealms();
    getExpansions();
    getSourceTypes();
  }, []);
  // searching();
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
              <input
                type="text"
                className="form-control"
                id="formGroupExampleInput"
                placeholder="Character"
                onChange={handleCharacter}
                autoFocus
              ></input>
            </div>
            <div>
              <input
                type="text"
                className="form-control"
                list="realms"
                id="realmsList"
                placeholder="Realm"
                onChange={handleRealm}
                autoComplete="off"
              ></input>
              <datalist id="realms">
                {realms.map((realm) => {
                  return <option key={realm.id} id={realm.id} value={realm.region + "-" + realm.name}></option>;
                })}
              </datalist>
            </div>
            <button className="btn btn-primary" type="button" onClick={getProfileProfessions}>
              Search
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
