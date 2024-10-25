import "./Contact.css";
import { useContext, useState } from "react";
import ListGroup from "../../ListProjects/ListProjects";

function Contact() {
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const items = ["Project 1", "Project 2", "Contacto 2"];
  return (
    <>
      <p>Contact</p>
      <div className="center-cointener">
        <ListGroup
          items={items}
          heading="Want to contact us?"
          onSelectItem={() => console.log("something")}
        ></ListGroup>
      </div>
    </>
  );
}

export default Contact;
