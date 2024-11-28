import { useNavigate } from "react-router";
import { IMG_URL } from "../App";
import { printDate } from "../data";
import Button from "./Button";

const HomepageEvent = (props) => {

    const event = props.event;
    const navigate = useNavigate();

    const getTickets = ()  => {
        navigate("/event-preview/" + event._id);
    }

    return <>
        <div className="connected-event homepage-event">
            <div className="slika">
                <img src={IMG_URL + "/events/" + event._id + "/" + event.picture} />
            </div>
            <div className="info1 width-100">
                <div className="naslov">{event.name}</div>
                <div className="datum">{printDate(event.date)}</div>
                <div className="opis">{event.description}</div>
                <div className="lokacija-i-dugme">
                    <div className="lokacija">{event.location}</div>
                    <div className="dugme">
                        <Button className="" tekst="Get tickets" bojaTeksta="white" bojaPozadine="black" poravnanje="centar" onClick={getTickets} />
                    </div>
                </div>                                
            </div>
        </div>
    </>
}; 


export default HomepageEvent;