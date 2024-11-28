import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/UserContext";



const UserMenu = (props) => {

    const userContext = useContext(UserContext);

    if (userContext.user === null) {
        return null;
    }

    const classObicna = "menu-item";
    const classSelektovana = "menu-item selected";


    const adminSekcija = <>
        <div className={props.select === "events" ? classSelektovana : classObicna}>
             <Link to={"/admin/events"}>Events</Link>
        </div>
        <div className={props.select === "users" ? classSelektovana : classObicna}>
            <Link to={"/admin/manage-users"}>Users</Link>
        </div>
    </>;

    return <div className="user-menu">
        {userContext.user.type === 1 && adminSekcija}
        <div className={props.select === "ticket-history" ? classSelektovana : classObicna}>
            <Link to={"/user/ticket-history"}>Ticket History</Link>
        </div>
        <div className={props.select === "user-details" ? classSelektovana : classObicna}>
            <Link to={"/user/user-details"}>User Details</Link>
        </div>
        <div className="menu-item">
            <Link to={"/logout"}>Logout</Link>
        </div>
    </div>

}

export default UserMenu;