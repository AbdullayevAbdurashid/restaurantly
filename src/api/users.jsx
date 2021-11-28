import axios from "axios";

export async function getCurrentUser() {
    const response = await localStorage.getItem("details");
    return response;
}

