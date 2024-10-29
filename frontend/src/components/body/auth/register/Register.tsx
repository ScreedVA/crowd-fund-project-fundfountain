import "./Register.css";
import RegisterForm from "./pages/RegisterForm";
import RegisterLeft from "./pages/RegistrationLeft";

function Register() {
  return (
    <>
      <div className="register-div" style={{ gridColumn: "1" }}>
        <div className="left-div">
          <RegisterLeft />
        </div>
        <div
          className="right-div"
          style={{
            gridColumn: "2",
            backgroundColor: "#2a4a6e",
          }}
        >
          <RegisterForm />
        </div>
      </div>
    </>
  );
}

export default Register;
