import { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { LOCALHOST_USER } from "../App";
import { useNavigate } from "react-router-dom";

const UserContextProvider = (props) =>{

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    
    useEffect(() =>{
        let u = localStorage.getItem("user");
        if (u) {
          u = JSON.parse(u);
          axios.post(LOCALHOST_USER + "/provera", {
            id: u.id
          },{
            headers: {
              authorization: u.token
            }
          }).then(() =>{
            setUser(u);
          }).catch(e =>{
            localStorage.removeItem("user");
            navigate("/login");
          });         
        }
    }, []);  

    const login= (email, password, uspehFunkcija, greskaFunkcija) =>{
      return axios.post(LOCALHOST_USER + '/login', {
        email: email,
        password:password
      }).then((response) =>{
        const u = {
          id: response.data.id,
          token: response.data.token,
          email: email,
          type: response.data.type
        }
        setUser(u);
        localStorage.setItem("user",JSON.stringify(u));

        uspehFunkcija(response);
      }).catch((error) =>{
        greskaFunkcija(error);
      });
    }


    const axiosData = (obj) => {
      if (obj === undefined) {
        return {};
      }

      if (user == null) {
        return obj;
      }

      return {
        ...obj,
        id: user.id
      }
    };

    const axiosOptions = (obj) => {
      if (obj === undefined || obj === null || user === null) {
        return {};
      }
      return {
        ...obj,
        headers: {
            authorization: user.token,
            ...obj.headers
        }
      }
    };

    const axiosRequest = (path, data, uspehFunkcija, greskaFunkcija) => {
      data = axiosData(data);
      let options = {
        headers: {
            authorization: user.token
        }
      };

      axios.post(path, data, options).then((response) =>{
        uspehFunkcija(response);
      }).catch((e) =>{
        if (greskaFunkcija !== undefined && greskaFunkcija !== null){
          greskaFunkcija(e);
        }      
      });
    }

    const axiosRequestDelete = (path, data, uspehFunkcija, greskaFunkcija) => {
      data = axiosData(data);
      let options = {
        headers: {
            authorization: user.token
        },
        data: data
      };
      console.log(data, options);

      axios.delete(path, options).then((response) =>{
        uspehFunkcija(response);
      }).catch((e) =>{
        if (greskaFunkcija !== undefined && greskaFunkcija !== null){
          greskaFunkcija(e);
        }      
      });
    }

    const logOut = () => {
      if (user === null){
        navigate("/");
        return;
      }

      // API poziv /users/logout
      axiosRequest(LOCALHOST_USER + "/logout", {}, (response) =>{
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
      })
    };  

    const ulogujRegistracija = (response) =>{
      const u = {
          id: response.data.id,
          token: response.data.token
      }
      setUser(u);
      localStorage.setItem("user",JSON.stringify(u));
    }
    
      //
    const userContextObj = {
        user: user,
        login: login,
        logOut: logOut,
        axiosData: axiosData,
        axiosOptions: axiosOptions,
        axiosRequest: axiosRequest,
        axiosRequestDelete: axiosRequestDelete,
        ulogujRegistracija: ulogujRegistracija
    };


    return <UserContext.Provider value={userContextObj}>
          {props.children}
      </UserContext.Provider>

};

export default UserContextProvider;