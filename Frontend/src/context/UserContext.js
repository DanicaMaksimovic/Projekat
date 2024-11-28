import { createContext } from "react";


const UserContext = createContext(null);
// react komponenta UserContext.Provider (kompnente kojima je potreban pristup)
// react komponenta UserContext.Consumer (hook za pristup vrednostima)

export default UserContext;