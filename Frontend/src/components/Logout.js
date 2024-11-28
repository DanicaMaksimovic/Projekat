import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";



const Logout = () =>{
    
    const userContext = useContext(UserContext);

    useEffect(() =>{
        if (userContext.user !== null){
            userContext.logOut();
        }
    }, [userContext.user]);

    return <></>;
}


export default Logout;