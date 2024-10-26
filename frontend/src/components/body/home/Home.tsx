import "./Home.css";
import HomeLeft from "./pages/HomeLeft";
import HomeCenter from "./pages/HomeCenter";
import HomeRight from "./pages/HomeRight";
import HomeHeader from "./pages/HomeHeader";

function Home() {
  return (
    <>
      <div className="home-header">
        <HomeHeader />
      </div>
      <div className="home-body">
        <div className="home-body-left grid-item">
          <HomeLeft />
        </div>
        <div className="home-body-center grid-item">
          <HomeCenter />
        </div>
        <div className="home-body-right grid-item">
          <HomeRight />
        </div>
      </div>
    </>
  );
}

export default Home;
