import { useContext } from "react";
import "../styles/Footer.css";
import UserContext from "../context/UserContext";

const Footer = () => {
    return <div className="footer">
        <div className="footer-elementi">
            Copyright TicketBlaster 2023-2024
        </div>
   </div>
}

export default Footer;