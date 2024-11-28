import { useContext, useEffect, useState } from "react";
import Button from "../Button";
import Input from "../Input";
import ConnectedEvent from "./ConnectedEvent";
import { IMG_URL, LOCALHOST_EVENT, LOCALHOST_UPLOAD } from "../../App";
import UserContext from "../../context/UserContext";
import axios from "axios";



const EventsCreateEdit = (props) => {

    const events = props.events;
    const userContext = useContext(UserContext);
    const [connectedEvents, setConnectedEvents] = useState([]);
    const [pictureURL, setPictureURL] = useState(null);
    const [picture, setPicture] = useState(null);
    const [greska, setGreska] = useState(null);

    useEffect(() => {
        if (props.eventToEdit !== null){
            document.getElementById("eventName").value = props.eventToEdit.name;
            document.getElementById("category").value = props.eventToEdit.category;
            document.getElementById("date").value = props.eventToEdit.date.split("T")[0];
            document.getElementById("eventDetails").value = props.eventToEdit.description;
            document.getElementById("ticketPrice").value = props.eventToEdit.price;        
            document.getElementById("location").value = props.eventToEdit.location;   
            setPictureURL(IMG_URL + "/events/" + props.eventToEdit._id + "/" + props.eventToEdit.picture);

            // povezani dogadjaji
            const nizDogadjaja = [];
            const povezaniDogadjaji = props.eventToEdit.linkedEvents;
            for(let i=0; i<povezaniDogadjaji.length; i++){
                const povezaniDogadjajId = povezaniDogadjaji[i];
                for(let j=0; j<props.events.length; j++){ 
                    console.log(props.events[j], povezaniDogadjajId);
                    if (props.events[j]._id === povezaniDogadjajId) {
                        nizDogadjaja.push(props.events[j]);
                    }
                }
            }
            console.log(nizDogadjaja, props.eventToEdit.linkedEvents);
            setConnectedEvents(nizDogadjaja);            
        }
    }, [props.eventToEdit]);


    const addConnectedEvent = () => {
        const selectElement = document.getElementById("connected-event-select");
        const id = selectElement.value;
        let event = null;
        for (let i = 0; i<events.length; i++) {
            if (events[i]._id === id) {
                event = events[i];
                break;
            }
        }

        let pronadjeno = false;
        for (let i=0; i<connectedEvents.length; i++) {
            if (connectedEvents[i]._id === id) {
                pronadjeno = true;
                break;
            }
        }
        if (!pronadjeno) {
            setConnectedEvents([...connectedEvents, event]);
        }
    };


    const removeConnectedEvent = (eventId) => {
        const noviNiz = [];
        for (let i =0; i < connectedEvents.length ; i++){
            if (connectedEvents[i]._id !== eventId) {
                noviNiz.push(connectedEvents[i]);
            }
        }

        setConnectedEvents(noviNiz);
    }


    const uploadEventArt = () => {
        const fileInput = document.getElementById("fileInput");
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0]; // Get the selected file
            if (file) {
              setPicture(file);
              console.log('Selected file:', file);
              const reader = new FileReader();
              reader.onload = (e) => {
            setPictureURL(e.target.result);                
              };
              reader.readAsDataURL(file); // Read the file as a data URL
            }
        })
        fileInput.click();
    };


    const save = () => {
        const eventName = document.getElementById("eventName").value;
        const category = document.getElementById("category").value;
        const eventDate = document.getElementById("date").value;
        const eventDetails = document.getElementById("eventDetails").value;
        const ticketPrice = document.getElementById("ticketPrice").value;        
        const location = document.getElementById("location").value;   

        if (props.eventToEdit === null){
            const nameOfThePicture = picture !== null ? picture.name : null;
            userContext.axiosRequest(LOCALHOST_EVENT + "/create-event", {
                name: eventName,
                category: category,
                date: eventDate,
                description: eventDetails,
                price: ticketPrice,
                location: location,
                qrcode: "-",
                picture: nameOfThePicture,
                linkedEvents: connectedEvents
            }, (response) => {
                console.log(response);

                //nema slike za upload
                if (nameOfThePicture === null) {
                    props.setIsTable(true);
                    return;
                }
    
                const formData = new FormData();
                formData.append('file', picture);
                formData.append("eventId", response.data.event._id);
    
                axios.post(LOCALHOST_UPLOAD + "/", formData, {
                    headers: {
                        contentType: "application/form-data"
                    }
                }).then((response) =>{                    
                    props.setIsTable(true);
                } ).catch((e) => {
                    console.error(e);
                    setGreska(e.response.data.error);
                });
    
            }, (e) => {    // od create eventa
                console.error(e);
                setGreska(e.response.data.error);
            });
        } else { // eventToEdit nije null
            userContext.axiosRequest(LOCALHOST_EVENT + "/edit-event", {
                eventId: props.eventToEdit._id,
                name: eventName,
                category: category,
                date: eventDate,
                description: eventDetails,
                price: ticketPrice,
                location: location,
                qrcode: "-",
                picture: picture === null ? props.eventToEdit.picture : picture.name,
                linkedEvents: connectedEvents
            }, (response) => {

                if (picture === null){
                    props.setIsTable(true);
                    props.setEventToEdit(null);
                    return;
                }


                const newAddedEvent = response.data.event;
    
                const formData = new FormData();
                formData.append('file', picture);
                formData.append("eventId", props.eventToEdit._id);
    
                axios.post(LOCALHOST_UPLOAD + "/", formData, {
                    headers: {
                        contentType: "application/form-data"
                    }
                }).then((response) =>{
                    console.log(response);
                    props.setIsTable(true);
                    props.setEventToEdit(null);
                } ).catch((e) => {
                    console.error(e);
                    setGreska(e.response.data.error);
                });
    
            }, (e) => {    // od create eventa
                console.error(e);
                setGreska(e.response.data.error);
            });
        }
        
        
    };

    return <>

        {greska !== null && <div className="greska greska-create-event">{greska}</div>}
        <form className="create-event-forma">
            <div className="red">
                <div className="kolona prva-kolona">
                    Event Name
                    <Input type="text" id="eventName" />

                </div>

                <div className="kolona">
                    Category
                    <select id="category" className="select">
                        <option value={0}>Musical concert</option>
                        <option value={1}>Stend-up comedy</option>
                    </select>

                </div>

                <div className="kolona">
                    Date
                    <Input type="date" id="date" />
                </div>
            </div>

            <div className="red">
                <div className="kolona prva-kolona">
                    <Button bojaTeksta="white" bojaPozadine="black" tekst="Upload Event Art" poravnanje="centar" 
                        onClick={uploadEventArt} />
                    <input type="file" id="fileInput" style={{display: "none"}}/>
                    <div className={"slika" + (pictureURL === null ? " nema-slike" : "")}>
                        {pictureURL === null && <>Event Photo</>}
                        {pictureURL !== null && <img src={pictureURL} />}
                    </div>
                </div>

                <div className="kolona">
                    Event Details
                    <textarea id="eventDetails" className="textarea"></textarea>

                    Ticket Price
                    <Input id="ticketPrice" type="number" min="0" className="ticket-price-input" />

                    Location
                    <Input id="location" type="text" className="location-input" />
                </div>               
            </div>

            {(events === null || events.length === 0) && 
                <div className="red">
                    <div className="kolona">
                        Nije moguće dodati povezane događaje
                    </div>
                </div>
            }


            {(events !== null && events.length > 0) &&
            <>
            <div className="red">

                <div className="kolona prva-kolona">
                    Related Events
                    <select id="connected-event-select" className="select">
                        {events.map((event, index) => {
                            if (props.eventToEdit !== null && event._id === props.eventToEdit._id){
                                return;
                            }
                            return <option key={index} value={event._id}>{event.name}</option>
                        })}
                    </select>
                </div>

                <div className="kolona kolona-add">
                    <Button className="add-dugme" tekst="Add" bojaTeksta="white" bojaPozadine="black" poravnanje="centar" 
                        onClick={addConnectedEvent} />
                </div>
            </div>            
            <div className="red connected-events">
                {connectedEvents.length === 0 && <div className="kolona">Nema povezanih događaja.</div>}
                {connectedEvents.length > 0 && connectedEvents.map((event, index) => {
                    return <ConnectedEvent key={index} event={event} removeConnectedEvent={removeConnectedEvent} />
                })}
            </div> </> 
            }

            <div className="red">
                <div className="kolona kolona-save">
                    <Button className="save-dugme" tekst="Save" bojaTeksta="white" bojaPozadine="black" poravnanje="centar" 
                         onClick={save} />
                </div>
            </div>
            
        </form>
    </>

}


export default EventsCreateEdit;