import React, { useContext, useState } from "react";
import { IMG_URL, LOCALHOST_EVENT } from "../../App";
import { printDate } from "../../data";
import { createPortal } from 'react-dom';

import Button from "../Button";
import Popup from "../Popup";
import UserContext from "../../context/UserContext";


const EventListElement = (props) => {

    const userContext = useContext(UserContext);
    const [isActiveDelete, setIsActiveDelete] = useState(false);


    const editEvent = (e) => {
        props.setEventToEdit(props.event);
        props.setIsTable(false);
    };

    const deleteEvent = () => {
        if (isActiveDelete) {
            setIsActiveDelete(false);        
        } else {
            setIsActiveDelete(true);        
        }
        
    };

    const closePopup = () =>{
        setIsActiveDelete(false);
    }

    const deleteEventFromPopup = () => {
        console.log("BRISANJE");
        userContext.axiosRequestDelete(LOCALHOST_EVENT + "/delete-event",{ idEvent: props.event._id }, (response) => {
            // ...
            // alert()
            const id = props.event._id;
            const newEvents = [];
            for(let i=0; i < props.events.length; i++) {
                if (props.events[i]._id !== id) {
                    newEvents.push(props.events[i]);
                }
            }
            props.setEvents(newEvents);
        });
        setIsActiveDelete(false);
    }

    return <div className="event">
                <div className="slika">
                    <img src={IMG_URL + "/events/" + props.event._id + "/" + props.event.picture} />
                </div>
                <div className="tekst">
                    <div className="naslov" onClick={editEvent}>{props.event.name}</div>
                    <div>
                        <span className="datum">{printDate(props.event.date)}</span>
                        <span className="lokacija">{props.event.location}</span>
                    </div>
                </div>
                <div className="akcija">
                    <Button bojaTeksta="white" bojaPozadine="black" tekst="Delete Event" onClick={deleteEvent} />
                </div>

                {isActiveDelete && createPortal(<Popup closePopup={closePopup} deleteEvent={deleteEventFromPopup} />, 
                    document.getElementById("portal"))}
            </div>;     
}

export default EventListElement;