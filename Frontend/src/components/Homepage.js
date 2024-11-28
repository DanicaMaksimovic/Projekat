import { useEffect, useState } from "react";
import { IMG_URL, LOCALHOST_EVENT } from "../App";
import Button from "./Button";
import axios from "axios";
import HomepageEvent from "./HomepageEvent";
import { printDate } from "../data";
import { Link, useNavigate } from "react-router-dom";



const Homepage = () => {

    const [homeEvents, setHomeEvents] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(LOCALHOST_EVENT + "/get-events").then((response) => {
            const data = response.data;
            setHomeEvents(data.events);
        });
    }, []);

    if (homeEvents === null) {
        return;
    }
    const mainEvent = homeEvents[0];


    const getTicketsMainEvent = () => {
        navigate("/event-preview/" + mainEvent._id);
    }

    return <>
        <div className="homepage global">
            <div className="glavni-dogadjaj">
                <img src={IMG_URL + "/events/" + mainEvent._id  + "/" + mainEvent.picture} />
                <div className="sadrzaj">
                    <div className="padding">
                        <div className="naslov-dogadjaja">
                            <div className="glavni-naslov">{mainEvent.name}</div>
                            <div className="podnaslov">{printDate(mainEvent.date)}, {mainEvent.location}</div>
                        </div>
                        <div className="dugme">
                            <Button tekst="Get tickets" bojaTeksta="black" bojaPozadine="white" poravnanje="centar" onClick={getTicketsMainEvent} />
                        </div>
                    </div>                   
                </div>
            </div>


            <div className="red odmakni">
                <div className="kolona-50-posto">
                    <h2>Musical Concerts</h2>

                    {homeEvents !== null && homeEvents.map((event, index) =>{
                        if (index === 0){
                            return;
                        }
                        if (event.category !== 0) {
                            return;
                        }
                        return <HomepageEvent event={event} key={index} />
                    })}
                </div>
                <div className="kolona-50-posto druga-kolona">
                    <h2>Stand-up Comedy</h2>

                    {homeEvents !== null && homeEvents.map((event, index) =>{
                        if (index === 0){
                            return;
                        }
                        if (event.category !== 1) {
                            return;
                        }
                        return <HomepageEvent event={event} key={index} />
                    })}
                </div>
            </div>

            <div className="red">
                <div className="kolona-50-posto">
                    <Link to="/musical-concerts" className="flex homepage-link">
                        <Button tekst="See all musical concerts" fullWidth bojaTeksta="black" bojaPozadine="white" poravnanje="centar" okvir="black" />
                    </Link>
                </div>
                <div className="kolona-50-posto druga-kolona">
                    <Link to="/stand-up-comedy" className="flex homepage-link">
                        <Button tekst="See all stand-up comedies" fullWidth bojaTeksta="black" bojaPozadine="white" poravnanje="centar" okvir="black" />
                    </Link>
                </div>
            </div>
        </div>
    </>;
}

export default Homepage;