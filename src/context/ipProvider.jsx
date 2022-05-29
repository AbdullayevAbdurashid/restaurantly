import React, {
    createContext,
} from "react";
import { io } from "socket.io-client";

const ip = "https://qr-restapi.vercel.app";
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
