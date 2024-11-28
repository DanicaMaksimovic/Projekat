import Button from "./Button";


const Popup = (props) => {

    return <>
        <div className="popup">
            <div className="sadrzaj">
                <div className="naslov">Are you sure?</div>
                <div className="tekst">
                    You are about to delete an event from the system.Please proceed with caution.
                </div>
                <div className="akcije">
                    <Button bojaTeksta="black" bojaPozadine="white" okvir="black" tekst="Cancel" onClick={props.closePopup} />
                    <Button className="delete-dugme" bojaTeksta="white" bojaPozadine="black" tekst="Delete Event" onClick={props.deleteEvent} />
                </div>
            </div>
        </div>
    </>
}


export default Popup;