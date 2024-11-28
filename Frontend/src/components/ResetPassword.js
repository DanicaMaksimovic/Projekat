import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import UserContext from "../context/UserContext";
import Input from "./Input";
import Button from "./Button";
import axios from "axios";
import { LOCALHOST_USER } from "../App";



const ResetPassword = () => {

    const [info, setInfo] = useState(false);
    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        if (token === undefined || token === null ||  email === undefined || email === null){ 
            navigate("/");
        }

        axios.post(LOCALHOST_USER + "/forgot-password-check-access", {
            email: email,
            passwordToken: token
        }).catch((e) => {
            navigate("/");
        });
    }, []);


    const submit = async () => {        
        const inputPassword = document.querySelector(".input-password").value;
        const inputPonoviPassword = document.querySelector(".input-ponovi-password").value;
        const token = searchParams.get("token");
        const email = searchParams.get("email");

        setError(null);
        if (inputPassword.trim().length === 0) {
            setError("Polje password ne sme biti prazno.");
            return;
        }


        if (inputPassword.trim().length < 8) {
            setError("Lozinka mora imati minimum 8 karaktera");
            return;
        }

        if (inputPassword !== inputPonoviPassword) {
            setError("Lozinke se ne podudaraju.");
            return;
        }    
        
        
        axios.post(LOCALHOST_USER + "/forgot-password-change", {
            email: email,
            passwordToken: token,
            password: inputPassword
        }).then((response) => {
            setInfo(true);
        });
    };

    return <>
      <div className="global">
        <div className="naslov">Reset Password</div>

        {info && <div className='info'>Uspesno ste promenili lozinku.</div>}      
        {error && <div className='greska'>{error}</div>}        

        {!info && 
        <div className="forma">
            <form>
                <div className='polje-password'>
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


export default ResetPassword;