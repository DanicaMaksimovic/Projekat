import { LOCALHOST_USER } from "../../App";
import UserContext from "../../context/UserContext";
import UserMenu from "./UserMenu";



const TicketHistory = (props) => {  

    return <>
        <div className="global">
            <div className="user-header">
                <div className="naslov">Ticket History</div>
                <UserMenu select="ticket-history" />
            </div>
            
            
        </div>
    </>
}

export default TicketHistory;