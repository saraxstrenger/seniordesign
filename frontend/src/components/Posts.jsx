import React from "react";

function Posts() {
  return (
    <div className="home">
      <div class="container">
        <div class="row align-items-center my-5" style={{ padding: "10px" , height:500}}>
          {/* <img
                class="img-fluid rounded mb-4 mb-lg-0"
                src="http://placehold.it/900x400"
                alt=""
              />
            // </div> */}
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div class="col-lg-5" style={{ padding: "10px" }}>
              <h1 class="font-weight-light">CIS 1210</h1>
              <p>Info about the class</p>
            </div>
            <div class="col-lg-5" style={{ padding: "10px" }}>
              <h1 class="font-weight-light">CIS 4000</h1>
              <p>Info about the class</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
