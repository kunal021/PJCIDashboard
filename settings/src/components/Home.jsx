import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ background: "black", margin: "0", padding: "0" }}>
      <div>
        <div id="logo"></div>
        <div id="container">
          <div className="krizyo">
            <p id="launch">Lauching Soon...</p>
          </div>
          <div className="krizyo">
            <p id="copyright">Copyright (c) 2024 pjci.in</p>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "50px",
          padding: "20px",
          color: "#ffffff",
        }}
      >
        <Link to={"/terms-and-conditions"} className="link">
          Terms And Conditions
        </Link>
        <Link to={"/privacy-policy"} className="link">
          Privacy Policy
        </Link>
        <Link to={"/about-us"} className="link">
          About Us
        </Link>
        <Link to={"/contact-us"} className="link">
          Contact Us
        </Link>
      </div>
    </div>
  );
}

export default Home;
