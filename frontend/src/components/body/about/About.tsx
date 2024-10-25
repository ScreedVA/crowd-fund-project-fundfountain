import "./About.css";
import photo from "./profile.jpg";

function About() {
  return (
    <>
      <img id="first" src={photo} alt="Profile" />
      <div className="center-cointener ">
        <h1 className="aline"> About Funding Projects!</h1>
        <p className="aline">
          In this page you will find projects to fund and people that will help
          you!
        </p>
      </div>
    </>
  );
}

export default About;
