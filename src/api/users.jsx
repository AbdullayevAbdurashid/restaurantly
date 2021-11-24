import axios from "axios";

export async function getCurrentUser() {
    const response = await axios.get("/api/user");
    return response.data.data;
}

