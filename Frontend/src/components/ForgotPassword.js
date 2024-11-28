import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { LOCALHOST_USER } from "../App";



const ForgotPassword = () => {

    const [info, setInfo] = useState(false);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const submit = async () => {        
        const inputEmail = document.querySelector(".input-email").value;        
        
        axios.post(LOCALHOST_USER + "/forgot-password-init", {
            email: inputEmail
        }); 
        setInfo(true);       
    };

    return <>
      <div className="global">
        <div className="naslov">Forgot Password</div>

        {info && <div className='info'>Ukoliko mejl postoji u sistemu, bice vam poslat zahtev za promenu lozinke.</div>}        

        {!info && 
        <div className="forma">
            <form>
                <div className='polje-email'>
                    <div className='boldovano'>E-mail</div>
                    <div>
                        <Input type='text' name="email" className="login-input input-email" />
                    </div>
                </div>

                <div className='akcije'>
                    <div  className='login-dugme fullwidth-dugme'>
                        <Button tekst="Send password reset email" fullWidth 
                            bojaPozadine="pink" bojaTeksta="white" onClick={submit} poravnanje="centar" />
                    </div>                    
                </div>


                <div className='registracija fullwidth-dugme'>
                    <Link to={"/login"}>
                        <Button 
                            bojaTeksta="black" 
                            bojaPozadine="white" 
                            okvir="pink" 
                            tekst="Back to login" 
                            fullWidth 
                            poravnanje="centar"
                            />
                    </Link>

                </div>
            </form>
            
        </div>  
        }
      </div>
    </>
}


export default ForgotPassword;