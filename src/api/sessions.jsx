import axios from "axios";

export async function login(email, password, ip) {
    console.log()
    const response = await axios.post(`${email.ip}/login`, { session: email, password });
    return response.data;
}

export async function logout() {
    const response = await axios.delete("/api/sessions");

    return response.data.data;
}