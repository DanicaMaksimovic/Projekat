import { useEffect, useState } from "react";
import Button from "../Button";
import UserMenu from "../User/UserMenu";
import EventsCreateEdit from "./EventsCreateEdit";
import { IMG_URL, LOCALHOST_EVENT, LOCALHOST_UPLOAD } from "../../App";
import axios from "axios";
import EventListElement from "./EventListElement";



const Events = () => {

    const [isTable, setIsTable] = useState(true);
    const [events, setEvents] = useState(null);
    const [eventToEdit, setEventToEdit] = useState(null);

    useEffect(() => {
        if (isTable) {
            axios.get(LOCALHOST_EVENT + "/get-events").then((response) => {
                const data = response.data;
                setEvents(data.events);
            });
        }       
    }, [isTable]);

    const createEventDugme = () => {
        setIsTable(false);
    };

    return <>
        <div className="global">
            <div className="user-header">
                <div className="naslov events-naslov">Events</div>
                {isTable && <div className="dugme">
                    <Button bojaTeksta="white" bojaPozadine="pink" tekst="Create Event" onClick={createEventDugme} />
                </div>}                
                <UserMenu select="events" />
            </div>
            
            {!isTable && <EventsCreateEdit events={events} eventToEdit={eventToEdit} 
                setEventToEdit={setEventToEdit} setIsTable={setIsTable} setEvents={setEvents} />}   

            {isTable && events !== null && <>
                <div className="event-list-table">
                    {events.map((event, index) => {
                        return <EventListElement key={index} event={event} setEvents={setEvents} events={events} 
                            setEventToEdit={setEventToEdit} setIsTable={setIsTable}
                        />;    
                    })}
                    
                </div>           
            </>}         

            
        </div>
    </>


}


export default Events;