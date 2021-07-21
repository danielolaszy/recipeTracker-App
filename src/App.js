// import logo from './logo.svg';
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import qs from "qs"; // used to oAuth token
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
// import { PushSpinner } from "react-spinners-kit";
import { motion } from "framer-motion";

// PROFESSION COMPONENT
function Profession({
  profession,
  expansions,
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

  const [recipeIds, setRecipeIds] = useState([]);
  const [sourceTypes, setSourceTypes] = useState([]);

  const getSourceTypes = () => {
    try {
      Axios.get("http://localhost:3001/sourcetypes/" + profession.profession.name).then((response) => {
        setSourceTypes(response.data);
      });
    } catch (err) {
      console.error("Failed to get sourcetypes from database: " + err);
    }
  };

  useEffect(() => {
    try {
      getSourceTypes();
      if (profession.tiers !== null) {
        const knownRecipes = profession.tiers.map((tier) =>
          tier.known_recipes
            ? tier.known_recipes.map((recipe) => recipe.id)
            : console.log("Failed to find known_recipes for ", tier)
        );
        setRecipeIds(knownRecipes.flat(1));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <section className="mb-5 pb-5">
        <motion.header className="d-flex flex-row border-bottom py-1 my-3 ">
          <div className="d-flex flex-fill align-self-baseline">
            <div className="d-flex flex-column flex-fill justify-content-start">
              <h3 className="fw-bolder m-0">{profession.profession.name}</h3>
            </div>
            <Avatar
              profileRealm={profileRealm}
              profileRegion={profileRegion}
              profileCharacterName={profileCharacterName}
              profileAvatar={profileAvatar}
              profileUrl={profileUrl}
            />
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
                  recipeIds={recipeIds}
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
function Expansion({ profession, expansion, sourceTypes, recipeIds }) {
  return (
    <>
      <section id={expansion.expansion} className="my-5">
        <header>
          <h5 className="m-0">{expansion.expansion}</h5>
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
  const [orderStyling, setOrderStyling] = useState("order-first");
  // console.log(sourceType.sourcetype);
  const orderSourceType = () => {
    if (sourceType.sourcetype === "unobtainable") {
      setOrderStyling("order-last");
    } else if (sourceType.sourcetype === "trainer") {
      setOrderStyling("order-1");
    } else if (sourceType.sourcetype === "vendor") {
      setOrderStyling("order-2");
    } else if (sourceType.sourcetype === "currency") {
      setOrderStyling("order-3");
    } else if (sourceType.sourcetype === "faction") {
      setOrderStyling("order-4");
    } else if (sourceType.sourcetype === "discovery") {
      setOrderStyling("order-5");
    } else if (sourceType.sourcetype === "drop") {
      setOrderStyling("order-first");
    }
  };

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
    orderSourceType();
  }, []);

  return (
    <>
      {recipes.length > 0 ? (
        <section className={"row my-1 flex-wrap " + orderStyling}>
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
                    style={{ maxWidth: "35px", filter: "grayscale(100%) brightness(15%)" }}
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

// AVATAR COMPONENT
function Avatar({ profileRealm, profileRegion, profileCharacterName, profileAvatar, profileUrl }) {
  return (
    <>
      {profileAvatar ? (
        <>
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
        </>
      ) : null}
    </>
  );
}

// OVERVIEW COMPONENT
function Overview({ professions, profileCharacterName, profileRealm, profileRegion, profileUrl, profileAvatar }) {
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

              <Avatar
                profileRealm={profileRealm}
                profileRegion={profileRegion}
                profileCharacterName={profileCharacterName}
                profileAvatar={profileAvatar}
                profileUrl={profileUrl}
              />
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
    if (profession.profession.name === "Archaeology" || profession.profession.name === "Fishing") {
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
                className={
                  profession.profession.name === "Archaeology" || profession.profession.name === "Fishing"
                    ? "progress-bar bg-secondary"
                    : "progress-bar"
                }
                role="progressbar"
                style={{ width: progressDisable() }}
              >
                {profession.profession.name === "Archaeology" || profession.profession.name === "Fishing"
                  ? null
                  : skillPoints + "/" + maxSkillPoints}
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

  return (
    <>
      <motion.nav variants={container} initial="hidden" animate="show" className="navbar navbar-expand-lg navbar-dark">
        <Link className="navbar-brand" to="/" value={[]} onClick={(e) => onClick(e.target.value)}>
          Recipe Tracker
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <NavLink className="nav-link" to="/overview">
              Overview
            </NavLink>

            {profileProfessions.map((profession) => {
              return profession ? (
                <NavLink key={profession.profession.id} className="nav-link" to={"/" + profession.profession.name}>
                  {profession.profession.name}
                </NavLink>
              ) : null;
            })}
          </div>
          <hr className="border-bottom my-1"></hr>
          <div className="navbar-nav d-flex flex-fill justify-content-end">
            <Link className="nav-link" to="/" value={[]} onClick={(e) => onClick(e.target.value)}>
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
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <div className="row justify-content-center align-items-center h-75">
      <motion.form
        variants={container}
        initial="hidden"
        animate="show"
        className="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-7 col-8 p-2 d-grid gap-2"
      >
        <h3 className="text-center">Recipe Tracker</h3>
        <div>
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
        </div>
        <div>
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
        </div>
        <Link
          to="/Overview"
          tabIndex="0"
          variants={item}
          className="btn btn-primary"
          onClick={props.getProfileProfessions}
        >
          Search
        </Link>
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
  // const [sourceTypes, setSourceTypes] = useState([]);

  const [accessToken, setAccessToken] = useState("");
  const [showInput, setShowInput] = useState(false);
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
        console.log("Fetching professions for " + profileCharacterName + " on " + profileRegion + "-" + profileRealm);
        if (response.data.primaries) {
          setProfileProfessions(response.data.primaries);
        }
        if (response.data.secondaries) {
          setProfileProfessions((profileProfessions) => [...profileProfessions, ...response.data.secondaries]);
        }
      })
      .then(getAvatar())
      .then(setShowInput(true))
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
        return "profileUrl not found";
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
  // const getSourceTypes = () => {
  //   try {
  //     Axios.get("http://localhost:3001/sourcetypes/").then((response) => {
  //       setSourceTypes(response.data);
  //     });
  //   } catch (err) {
  //     console.error("Failed to get sourcetypes from database: " + err);
  //   }
  // };

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
    // getSourceTypes();
  }, []);

  const onchange = (data) => {
    setProfileCharacterName(data.characterName.toLowerCase());
    setProfileRegion(data.realm.slice(0, 2));
    setProfileRealm(data.realm.slice(3, 255));
  };

  return (
    <Router>
      <div className="container vh-100">
        {showInput ? (
          <>
            <Navbar profileProfessions={profileProfessions} onClick={() => setShowInput(false)} />
          </>
        ) : (
          <Input
            data={state}
            onChange={(data) => onchange(data)}
            realms={realms}
            getProfileProfessions={getProfileProfessions}
          />
        )}

        <Switch>
          {profileProfessions ? (
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
          ) : null}

          {profileProfessions.map((profession) => {
            return profession ? (
              <Route
                key={profession.profession.id}
                path={"/" + profession.profession.name}
                render={() => (
                  <Profession
                    profession={profession}
                    expansions={expansions}
                    // sourceTypes={sourceTypes}
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
