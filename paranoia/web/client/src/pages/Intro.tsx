import React from "react";
import { Link } from "react-router-dom";
import eyes from "../../paranoiaEyes.png";
import SimplePage from "../components/SimplePage";

export default function Intro() {
  return (
    <SimplePage>
      <div style={{ fontSize: "10em", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src={eyes} style={{ maxWidth: "50%" }}></img>
        paranoia
      </div>
      <Link to="create">
        <button className="pure-button" style={{ backgroundColor: "#c9a0dcff" }}>
          Create Game
        </button>
      </Link>
      <div style={{ fontSize: "2em" }}>or</div>
      <Link to="join">
        <button className="pure-button">Join Game</button>
      </Link>
    </SimplePage>
  );
}
