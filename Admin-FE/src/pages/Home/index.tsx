// @flow
// libs
import React from "react";
// others
import "./style.scss";
//Material UI
import homeimg from "../../img/home.jpg";

const Home = () => {
  return (
    <div className="home">
      <br />
      <img src={homeimg} />
      <h2 className="home__intro">
       Welcome back! 💙
      </h2>
    </div>
  );
};

export default Home;
