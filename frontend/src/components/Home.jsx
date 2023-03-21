import React from "react";
import Logout from "./Logout";
import NavBar from "./NavBar";
import styles from "./css/utils.module.css";

function Home(props) {
  const [data, setData] = React.useState(null);
  const [dataDidLoad, setDataDidLoad] = React.useState(false);
  React.useEffect(() => {
    fetch("/home", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return res.json();
        } else {
          props.isLoggedIn(false);
        }
      })
      .then((data) => {
        setDataDidLoad(true);
        setData(data.message);
      });
  }, [props]);
  return (
    <>
      <NavBar />
      <div className={styles.page} style={{ padding: 20, height: 500 }}>
        <div className="container">
          <div className="row align-items-center my-5">
            <div className="col-lg-5">
              <h1 className="font-weight-light">Home page</h1>
              {dataDidLoad === false ? <p>Loading... </p> : <p>{data}</p>}
              <Logout {...props} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
