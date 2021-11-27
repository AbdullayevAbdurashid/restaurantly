import axios from "axios";

export async function login(email, password) {
    const response = await axios.post("http://localhost:4000/login", { session: email, password });
    return response.data;
}

export async function logout() {
    const response = await axios.delete("/api/sessions");

    return response.data.data;
}