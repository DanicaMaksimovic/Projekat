import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css'
import Button from './Button';
import Input from './Input';
import { useContext, useState } from 'react';
import UserContext from '../context/UserContext';
import { string } from "yup";

const Login = (props) =>{

    const [error, setError] = useState(null);
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const submit = async () => {
        const inputEmail = document.querySelector(".input-email").value;
        const inputPassword = document.querySelector(".input-password").value;

        setError(null);
        if (inputEmail.trim().length === 0) {
            setError("Polje email ne moze biti prazno");
            return;
        }
        if (!string().email().isValidSync(inputEmail)) {
            setError("Polje email nije validno");
            return;
        }
        if (inputPassword.trim().length === 0) {
            setError("Polje password ne moze biti prazno");
            return;
        }
        
        userContext.login(inputEmail, inputPassword, (response) => {
            navigate("/user/ticket-history");
        }, (e) => {
            setError(e.response.data.error);
        });
    };

    return <>
      <div className="global">
        <div className="naslov">Login</div>

        <div className='greska'>{error}</div>

        <div className="forma">
            <form>
                <div className='polje-email'>
                    <div className='boldovano'>E-mail</div>
                    <div>
                        <Input type='text' name="email" className="login-input input-email" />
                    </div>
                </div>

                <div className='polje-password'>
                    <div className='boldovano'>Password</div>
                    <div>
                        <Input type='password' name="password" className="login-input input-password" />
                    </div>
                </div>

                <div className='akcije'>
                    <div className='zaboravljena-lozinka'>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                    <div  className='login-dugme'>
                        <Button tekst="Log In" bojaPozadine="pink" bojaTeksta="white" onClick={submit} />
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

};

export default Login;