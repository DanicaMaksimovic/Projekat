import { BrowserRouter, Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Button from './Button';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

import korpa from "../fajlovi/slike/shopping_cart.png";
import userimg from "../fajlovi/slike/person.png";
import Input from './Input';

const Navbar = () => {

    const userContext = useContext(UserContext);

    let dugmici = <>
        <Link to={"/login"}>
            <Button 
                tekst="Log in"
                bojaPozadine="pink"
                className="dugme-razmak"
            />
        </Link>
        <Link to={"/register"}>
            <Button 
                tekst="Create account" 
                bojaPozadine="black" 
                bojaTeksta="white"
                okvir="pink" />
        </Link>
    </>;
    if (userContext.user !== null){ 
        dugmici = null;
    }

    let loggedinSadrzaj = <>
        <div className='loggedin-sadrzaj'>
            <div className='korpa'>
                <Link to={"/cart"}>
                    <img src={korpa} />
                </Link>                
            </div>
            <div className='user'>
                <Link to={"/user/ticket-history"}>
                    <img src={userimg} />
                </Link>   
            </div>
        </div>
    </>;
    if (userContext.user === null){
        loggedinSadrzaj = null;
    }

    return <div className="navbar">
            <div className='navbar-elementi'>
                <div className='logo'>
                    <Link to={'/'}>ticketblaster</Link>
                </div>
                <div className='navbar-link'>
                    <Link to={'musical-concerts'}>Musical Concerts</Link>
                </div>
                <div className='navbar-link'>                   
                    <Link to={'stand-up-comedy'}>Stand-up Comedy</Link>
                </div>

                <div className={`navbar-input${userContext.user === null ? "" : " navbar-input-pomereno"}`}>
                    <Input placeholder={"Search"} petar="ABC" className="INPUT-8" />
                </div>


                <div className='navbar-dugmici'>

                    {dugmici}
                    {loggedinSadrzaj}

                </div>
            </div>
        </div>
}

export default Navbar;