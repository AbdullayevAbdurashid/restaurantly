import React, {
    createContext,
} from "react";
import { io } from "socket.io-client";

const ip = "http://localhost:4000";
const socket = io(ip);

export const IpContext = createContext();

export function IPprovider({
    children,
}) {



    return (
        <IpContext.Provider value={[ip, socket]}>
            {children}
        </IpContext.Provider>
    )
}
