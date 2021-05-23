import React from "react";
import Multiselect from "react-widgets/Multiselect";
import Button from "../components/Button";
import SimplePage from "../components/SimplePage";

export default function Create() {
  const [people, setPeople] = React.useState([]);
  const [selectedPeople, setSelectedPeople] = React.useState([]);
  return (
    <SimplePage>
      <h1>Add Players</h1>
      <div style={{ width: "400px" }}>
        <Multiselect
          dropUp
          allowCreate
          onCreate={(created) => setPeople([...people, created])}
          onChange={(person) => setSelectedPeople([...selectedPeople, person])}
          data={people}
        ></Multiselect>
      </div>
      <br></br>
      <Button>Create Game</Button>
    </SimplePage>
  );
}
