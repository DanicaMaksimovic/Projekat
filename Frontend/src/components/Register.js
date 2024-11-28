import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";
import { LOCALHOST_USER } from "../App";
import axios from "axios";
import { string } from "yup";


const Register = () =>{

    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const submit = async () => {
        const inputName = document.querySelector(".input-name").value;
        const inputSurname = document.querySelector(".input-surname").value;
        const inputEmail = document.querySelector(".input-email").value;
        const inputPassword = document.querySelector(".input-password").value;
        const inputPonoviPassword = document.querySelector(".input-ponovi-password").value;       

        setError(null);
        if (inputName.trim().length < 3){
            setError("Ime mora imati minimalno 3 karaktera");
            return;
        }
        if (inputSurname.trim().length < 3){
            setError("Prezime mora imati minimalno 3 karaktera");
            return;
        }
       
        if (!string().required().email().isValidSync(inputEmail)){
            setError("Email nije validan");
            return;
        }
        if (inputPassword.trim().length < 8) {
            setError("Password mora imati minimalno 8 karaktera");
            return;
        }
        if (inputPassword.trim() !== inputPonoviPassword.trim()) {
            setError("Lozinke se ne podudaraju");
            return;
        }
        axios.post(LOCALHOST_USER + "/registar", {
            name: inputName,
            surname: inputSurname,
            email: inputEmail,
            password: inputPassword
        }).then((response) => {
            userContext.ulogujRegistracija(response);
            navigate("/user/ticket-history");
        }).catch((e) => {
            setError(e.response.data.error);
        });
    };

    return <>
      <div className="global">
        <div className="naslov">Create account</div>

        <div className='greska'>{error}</div>

        <div className="forma">
            <form>
                <div className='polje-name'>
                    <div className='boldovano'>Name</div>
                    <div>
                        <Input type='text' name="name" className="login-input input-name" />
                    </div>
                </div>

                <div className='polje-surname margin-top'>
                    <div className='boldovano'>Surname</div>
                    <div>
                        <Input type='text' name="fullname" className="login-input input-surname" />
                    </div>
                </div>

                <div className='polje-email margin-top'>
                    <div className='boldovano'>E-mail</div>
                    <div>
                        <Input type='text' name="email" className="login-input input-email" />
                    </div>
                </div>

                <div className='polje-password margin-top'>
                    <div className='boldovano'>Password</div>
                    <div>
                        <Input type='password' name="password" className="login-input input-password" />
                    </div>
                </div>

                <div className='polje-ponovi-password margin-top'>
                    <div className='boldovano'>Re-type Password</div>
                    <div>
                        <Input type='password' name="password" className="login-input input-ponovi-password" />
                    </div>
                </div>

                <div className='akcije margin-top'>
                    <div  className='create-account-dugme'>
                        <Button tekst="Create Account" fullWidth bojaPozadine="pink" bojaTeksta="white" onClick={submit} poravnanje="centar" />
                    </div>                                     
                </div>

                <div className='registracija'>
                    <Button 
                        bojaTeksta="black" 
                        bojaPozadine="white" 
                        okvir="pink" 
                        tekst="Don't have an account?" 
                        fullWidth 
                        poravnanje="centar"
                         />
                </div>
            </form>
            
        </div>
      </div>
    </>

}


export default Register;