import { useContext, useState } from "react";
import { IMG_URL, LOCALHOST_USER } from "../../App";
import Button from "../Button";
import Input from "../Input";
import UserMenu from "./UserMenu";
import UserContext from "../../context/UserContext";
import axios from "axios";

// /update-data
/* const [name, setName] = useState(""); // Držanje vrednosti inputa
    const [status, setStatus] = useState(""); // Za povratnu informaciju

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // API poziv za ažuriranje imena
            const response = await axios.post("http://localhost:3000/api/update-name", {
                newName: name,
            });

            if (response.data.success) {
                setStatus("Ime je uspešno ažurirano!");
            } else {
                setStatus("Došlo je do greške. Pokušajte ponovo.");
            }
        } catch (error) {
            console.error("Greška pri ažuriranju imena:", error);
            setStatus("Greška na serveru.");
        }
    };*/


const UserDetails = () => {
    const userContext = useContext(UserContext)

    const [nema, setName] = useState("");

    const submitDetails = (d) =>{
        const name = document.getElementById('name').value;
        console.log(d.name)
     ///   const response = await axios.post(LOCALHOST_USER , {
     //       newName: name,
    //  });
    }


    return <>
        <div className="global">
            <div className="user-header">
                <div className="naslov">User Details</div>
                <UserMenu select="user-details" />
            </div>
            <div className="UserDetails">
                <div className="kolona-jedan">
                    <img src={IMG_URL + "130932846.jpg"} />
                    <Button bojaTeksta="pink" bojaPozadine="white" tekst="Uploud Avatar" okvir="black"/>
                    <Button bojaTeksta="white" bojaPozadine="black" tekst="Submit"/>
                </div>
                <div className="kolona-dva">
                    Full name
                    <Input id="name" type="text"/>
                    E-mail
                    <Input id="Email"/>
                </div>
            </div>
            <div className="kolona-tri">
                <p>Password</p>
                <Button bojaTeksta="white" bojaPozadine="pink" tekst="Change Password" onClik={submitDetails}/>
            </div>
            
        </div>
    </>
}



export default UserDetails;