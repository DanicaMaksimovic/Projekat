import { IMG_URL } from "../../App";
import Button from "../Button";


const ConnectedEvent = (props) => {

    const event = props.event;

    const remove = () => {
        props.removeConnectedEvent(event._id);
    };

    return <>
        <div className="connected-event">
            <div className="slika">
                <img src={IMG_URL + "/events/" + event._id + "/" + event.picture} />
            </div>
            <div className="info1">
                <div className="naslov">{event.name}</div>
                <div className="datum">June 9th, 2024</div>
                <div className="lokacija">{event.location}</div>
                <div className="dugme">
                    <Button className="" tekst="Remove" bojaTeksta="white" bojaPozadine="black" poravnanje="centar" 
                     onClick={remove} />
                </div>                
            </div>
        </div>
    </>
}; 


export default ConnectedEvent;