import React, {
    createContext,
    useContext,
    useMemo,
} from "react";
import { io } from "socket.io-client";

const ip = "http://localhost:4000"
const socket = io(ip)

const IpContext = createContext(
    {
        ip: null,
        socket: null,
    }
);

export function IPprovider({
    children,
}) {
    const memoedValue = useMemo(
        () => ({

            ip,
            socket,
        }),
        [ip, socket]
    );

    return (
        <IpContext.Provider value={memoedValue}>
            {children}
        </IpContext.Provider>
    )
}

export default function useIp() {
    return useContext(IPprovider);
}
