import logo from './logo.svg';
import './App.css';
import React from "react";

function App() {
  const [data, setData] = React.useState(null);
  const [info, setInfo]= React.useState({name: "Janavi", year: 2023});
  React.useEffect(() => {
    fetch("/home")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <p> {info.name}</p>
        <p> {info.year?.toString()}</p>
        <button onClick={()=> setInfo({name: "sara"})}>button</button>
      
      </header>
    </div>
  );
}


export default App;
