// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import qs from "qs"; // used to oAuth token
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import { PushSpinner } from "react-spinners-kit";
import { motion } from "framer-motion";

// PROFESSION COMPONENT
function Profession({
  profession,
  expansions,
  sourceTypes,
  profileCharacterName,
  profileRealm,
  profileRegion,
  profileUrl,
  profileAvatar,
}) {
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <>
      <section className="mb-5 pb-5">
        <motion.header className="d-flex flex-row border-bottom py-1 my-3 ">
          <div className="d-flex flex-fill align-self-baseline">
            <div className="d-flex flex-column flex-fill justify-content-start">
              <h1 className="fw-bolder mb-1">{profession.profession.name}</h1>
            </div>
            <div className="d-flex flex-column align-self-end">
              <h6 className="text-end text-capitalize m-0 p-0">{profileCharacterName}</h6>
              <p className="text-end m-0 p-0 fw-normal small">
                {profileRealm && profileRegion ? profileRegion + "-" + profileRealm : null}
              </p>
            </div>
            <div className="d-flex flex-column align-self-end">
              <a className="text-decoration-none" href={profileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={profileAvatar}
                  className="rounded-3 ms-2"
                  style={{ maxWidth: "40px" }}
                  alt="Profile Avatar"
                ></img>
              </a>
            </div>
          </div>
        </motion.header>
        <motion.article initial="hidden" animate="visible" variants={variants}>
          {profession.profession.name === "Fishing" || profession.profession.name === "Archaeology" ? (
            <div className="d-flex align-items-center">
              <p className="text-center">{"Could not find any recipes for " + profession.profession.name + "..."}</p>
            </div>
          ) : (
            expansions.map((expansion) => {
              return (
                <Expansion
                  key={expansion.expansion}
                  profession={profession}
                  expansion={expansion}
                  sourceTypes={sourceTypes}
                />
              );
            })
          )}
        </motion.article>
      </section>
    </>
  );
}

// EXPANSION COMPONENT
function Expansion({ profession, expansion, sourceTypes }) {
  const [recipeIds, setRecipeIds] = useState([]);

  useEffect(() => {
    try {
      if (profession.tiers !== null) {
        const knownRecipes = profession.tiers.map((tier) =>
          tier.knownrecipes !== null ? tier.known_recipes.map((recipe) => recipe.id) : null
        );
        setRecipeIds(knownRecipes.flat(1));
      }
    } catch (err) {
      console.error(err);
    }
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
                recipeIds={recipeIds}
              />
            );
          })}
        </article>
      </section>
    </>
  );
}

// SOURCETYPE COMPONENT
function SourceType({ profession, expansion, sourceType, recipeIds }) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Getting recipes from database
  const getRecipes = () => {
    Axios.get(
      "http://localhost:3001/recipes/" +
        profession.profession.name +
        "/" +
        expansion.expansion +
        "/" +
        sourceType.sourcetype
    )
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((err) => console.error(err));
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
              return recipeIds.includes(recipe.id) ? (
                <a key={recipe.id} href={"https://www.wowhead.com/recipe/" + recipe.id}>
                  <img
                    id={recipe.id}
                    src={process.env.PUBLIC_URL + "/icons/" + recipe.icon + ".jpg"}
                    className="rounded-3 border border-success"
                    style={{ maxWidth: "35px" }}
                    alt={recipe.name}
                  ></img>
                </a>
              ) : (
                <a key={recipe.id} href={"https://www.wowhead.com/recipe/" + recipe.id}>
                  <img
                    id={recipe.id}
                    src={process.env.PUBLIC_URL + "/icons/" + recipe.icon + ".jpg"}
                    className="rounded-3 border border-danger"
                    style={{ maxWidth: "35px", filter: "grayscale(100%)", filter: "brightness(15%)" }}
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

// OVERVIEW COMPONENT
function Overview({ professions, profileCharacterName, profileRealm, profileRegion, profileUrl, profileAvatar }) {
  console.log(professions);
  const variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  return (
    <>
      {professions ? (
        <motion.section initial="hidden" animate="visible" variants={variants}>
          <motion.header className="d-flex flex-row border-bottom py-1 my-3 ">
            <div className="d-flex flex-fill align-self-baseline">
              <div className="d-flex flex-column flex-fill justify-content-start">
                <h1 className="fw-bolder mb-1">Overview</h1>
              </div>
              <div className="d-flex flex-column align-self-end">
                <h6 className="text-end text-capitalize m-0 p-0">{profileCharacterName}</h6>
                <p className="text-end m-0 p-0 fw-normal small">
                  {profileRealm && profileRegion ? profileRegion + "-" + profileRealm : null}
                </p>
              </div>
              <div className="d-flex flex-column align-self-end">
                <a className="text-decoration-none" href={profileUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={profileAvatar}
                    className="rounded-3 ms-2"
                    style={{ maxWidth: "40px" }}
                    alt="Profile Avatar"
                  ></img>
                </a>
              </div>
            </div>
          </motion.header>
          <article>
            {professions.map((profession) => {
              return <Progress key={profession.profession.name} profession={profession} />;
            })}
          </article>
        </motion.section>
      ) : null}
    </>
  );
}

// PROGRESS COMPONENT
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
  // Calculating the percentage for the width of the progress bar
  const calcPercentage = () => {
    if ((profession.id = 794)) {
      const percentage = (skillPoints / maxSkillPoints) * 100 + "%";
      return percentage;
    }
  };
  // Making progress bar disabled if profession is Archaeology
  const progressDisable = () => {
    if (profession.profession.name === "Archaeology") {
      return 100 + "%";
    } else {
      return calcPercentage();
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
                style={{ width: progressDisable() }}
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

// NAVBAR COMPONENT
function Navbar({ profileProfessions, onClick }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <>
      <motion.nav variants={container} initial="hidden" animate="show" class="navbar navbar-expand-lg navbar-dark">
        <Link className="navbar-brand" to="/" value={[]} onClick={(e) => onClick(e.target.value)}>
          Recipe Tracker
        </Link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div class="navbar-nav">
            <NavLink className="nav-link" to="/overview" activeClassName="selected">
              Overview
            </NavLink>

            {profileProfessions.map((profession) => {
              return profession ? (
                <NavLink
                  key={profession.profession.id}
                  className="nav-link"
                  to={"/" + profession.profession.name}
                  activeClassName="active"
                >
                  {profession.profession.name}
                </NavLink>
              ) : null;
            })}
          </div>
          <hr className="border-bottom my-1"></hr>
          <div class="navbar-nav d-flex flex-fill justify-content-end">
            <Link
              className="nav-link"
              to="/"
              activeClassName="selected"
              value={[]}
              onClick={(e) => onClick(e.target.value)}
            >
              Log out
            </Link>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

// INPUT COMPONENT
function Input(props) {
  const [state, setState] = useState({
    characterName: "",
    realm: "",
  });

  const handleChange = (event) => {
    props.onChange({ ...state, [event.target.name]: event.target.value });
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.01,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <div className="row m-3 justify-content-center align-items-center h-75">
      <motion.form
        variants={container}
        initial="hidden"
        animate="show"
        className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-7 col-8 p-2 d-grid gap-2"
      >
        <motion.h3 className="text-center">Recipe Tracker</motion.h3>
        <motion.div variants={item}>
          <input
            type="text"
            className="form-control"
            id="formGroupExampleInput"
            placeholder="Character"
            name="characterName"
            value={state.characterName}
            // onChange={(event) => props.onChange(event.target.value)}
            onChange={handleChange}
            autoFocus
          ></input>
        </motion.div>
        <motion.div variants={item}>
          <input
            type="text"
            className="form-control"
            list="realms"
            id="realmsList"
            placeholder="Realm"
            name="realm"
            value={state.realm}
            autoComplete="off"
            onChange={handleChange}
            // onChange={(event) => props.onChange(event.target.value)}
          ></input>
          <datalist id="realms">
            {props.realms.map((realm) => {
              return <option key={realm.id} id={realm.id} value={realm.region + "-" + realm.name}></option>;
            })}
          </datalist>
        </motion.div>
        <motion.Link
          to="/Overview"
          tabindex="0"
          variants={item}
          className="btn btn-primary"
          onClick={props.getProfileProfessions}
        >
          Search
        </motion.Link>
      </motion.form>
    </div>
  );
}

// APP COMPONENT
function App() {
  const [profileRegion, setProfileRegion] = useState("");
  const [profileRealm, setProfileRealm] = useState("");
  const [profileCharacterName, setProfileCharacterName] = useState("");
  const [profileProfessions, setProfileProfessions] = useState([]);
  const [profileAvatar, setProfileAvatar] = useState("");

  const [realms, setRealms] = useState([]);
  const [expansions, setExpansions] = useState([]);
  const [sourceTypes, setSourceTypes] = useState([]);

  const [accessToken, setAccessToken] = useState("");

  const [state, setState] = useState({
    characterName: "",
    realm: "",
  });

  // creating baseURL for Axios
  const blizzApi = Axios.create({
    baseURL: "https://" + profileRegion + ".api.blizzard.com/",
    headers: {
      // "Battlenet-Namespace": "profile-" + profileRegion,
      "Authorization": "Bearer " + accessToken,
    },
  });

  // Getting professions for character input in the fields
  const getProfileProfessions = () => {
    getAccessToken();
    const realmFind = findRealm();
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
        if (response.data.secondaries) {
          setProfileProfessions((profileProfessions) => [...profileProfessions, ...response.data.secondaries]);
        }
      })
      .then(getAvatar())
      .catch((err) => console.error(err));
  };

  const findRealm = () => {
    try {
      return realms.find((realm) => realm.name === profileRealm && realm.region === profileRegion);
    } catch (err) {
      console.error("Failed to filter realm: " + err);
    }
  };

  const getProfileUrl = () => {
    try {
      if (profileRegion === "US") {
        // If input region is US get US link
        return (
          "https://worldofwarcraft.com/en-us/character/" +
          profileRegion.toLowerCase() +
          "/" +
          findRealm().slug +
          "/" +
          profileCharacterName
        );
      } else if (profileRegion === "EU") {
        // If input region is EU get EU link
        return (
          "https://worldofwarcraft.com/en-gb/character/" +
          profileRegion.toLowerCase() +
          "/" +
          findRealm().slug +
          "/" +
          profileCharacterName
        );
      } else {
        return "no";
      }
      // STILL NEED TO ADD ASIAN ARMORY
    } catch (err) {
      console.error(err);
    }
  };

  // Getting OAuth2 access token for Blizzard API
  const getAccessToken = () => {
    const data = { "grant_type": "client_credentials" };
    Axios.request({
      url: "/oauth/token",
      method: "post",
      baseURL: "https://us.battle.net/",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      auth: {
        username: process.env.REACT_APP_CLIENT_ID,
        password: process.env.REACT_APP_CLIENT_SECRET,
      },
      data: qs.stringify(data),
    })
      .then((response) => setAccessToken(response.data.access_token))
      .catch((err) => console.error(err));
  };

  // Getting profile Avatar from Blizzard API
  const getAvatar = () => {
    blizzApi
      .get(
        "/profile/wow/character/" +
          findRealm().slug +
          "/" +
          profileCharacterName +
          "/character-media?namespace=profile-" +
          profileRegion.toLowerCase() +
          "&locale=en_US"
      )
      .then((response) =>
        response.data.avatar_url
          ? setProfileAvatar(response.data.avatar_url)
          : setProfileAvatar(response.data.assets[0].value)
      )
      .catch((err) => console.error("Failed to get avatar: " + err));
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

  // const handleCharacter = (data) => {
  //   // setProfileCharacterName(data); // toLowerCase is needed, otherwise API won't accept character name
  //   console.log("handleCharacter: " + data);
  // };

  // const handleRealm = (data) => {
  //   setProfileRegion(data.slice(0, 2));
  //   setProfileRealm(data.slice(3, 255));
  // };

  useEffect(() => {
    getRealms();
    getExpansions();
    getSourceTypes();
  }, []);

  const onchange = (data) => {
    setProfileCharacterName(data.characterName.toLowerCase());
    setProfileRegion(data.realm.slice(0, 2));
    setProfileRealm(data.realm.slice(3, 255));
  };

  return (
    <Router>
      <div className="container vh-100">
        {profileProfessions.length > 0 ? (
          <Navbar profileProfessions={profileProfessions} onClick={() => setProfileProfessions([])} />
        ) : null}
        <Switch>
          <Route
            exact
            path="/"
            render={() =>
              profileProfessions.length < 1 ? (
                <Input
                  data={state}
                  onChange={(data) => onchange(data)}
                  // onChange={(realm) => handleRealm(realm)}
                  realms={realms}
                  getProfileProfessions={getProfileProfessions}
                />
              ) : null
            }
          />

          <Route
            path="/Overview"
            render={() => (
              <Overview
                professions={profileProfessions}
                expansions={expansions}
                profileCharacterName={profileCharacterName}
                profileRealm={profileRealm}
                profileRegion={profileRegion}
                profileUrl={getProfileUrl()}
                profileAvatar={profileAvatar}
              />
            )}
          />

          {profileProfessions.map((profession) => {
            return profession ? (
              <Route
                key={profession.profession.id}
                path={"/" + profession.profession.name}
                render={() => (
                  <Profession
                    profession={profession}
                    expansions={expansions}
                    sourceTypes={sourceTypes}
                    profileCharacterName={profileCharacterName}
                    profileRealm={profileRealm}
                    profileRegion={profileRegion}
                    profileSlug={findRealm()}
                    profileUrl={getProfileUrl()}
                    profileAvatar={profileAvatar}
                  />
                )}
              />
            ) : null;
          })}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
