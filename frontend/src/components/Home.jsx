import React from "react";
import Logout from "./Logout";

function Home(props) {
  const [data, setData] = React.useState(null);
  const [dataDidLoad, setDataDidLoad] = React.useState(false);
  React.useEffect(() => {
    fetch("/home")
      .then((res) => res.json())
      .then((data) => {
        setDataDidLoad(true);
        setData(data.message);
      });
  }, []);
  return (
    <div className="home" style={{ backgroundColor: "lightpink", padding: 20 }}>
      <div class="container">
        <div class="row align-items-center my-5">
          <div class="col-lg-5">
            <h1 class="font-weight-light">Home page</h1>
            {dataDidLoad === false ? <p>Loading... </p> : <p>{data}</p>}
            <Logout {...props}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
