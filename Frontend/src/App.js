import './App.css';
import './styles/Global.css';
import './styles/User.css';
import './styles/Events.css';
import './styles/Popup.css';
import './styles/Homepage.css';
import Navbar from './components/Navbar';
import Page from './components/Page';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import UserContext from './context/UserContext';
import UserContextProvider from './context/UserContextProvider';

export const LOCALHOST_USER = "http://localhost:3001/user";
export const LOCALHOST_EVENT = "http://localhost:3003/event";
export const LOCALHOST_UPLOAD = "http://localhost:3005/upload";
export const IMG_URL = "http://localhost:3005/slike";

function App() {

  useEffect(() => {
    document.title = "TicketBlaster";
  }, []); 

  return (
    <div className="App">
      <UserContextProvider>
          <Navbar />
          <Page />
          <Footer />
      </UserContextProvider>
      <div id="portal"></div>
    </div>
  );
}

export default App;
