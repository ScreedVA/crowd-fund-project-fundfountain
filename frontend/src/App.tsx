import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Body from "./components/body/Body";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Body />
      </Router>
      <Footer />
    </>
  );
}

export default App;
