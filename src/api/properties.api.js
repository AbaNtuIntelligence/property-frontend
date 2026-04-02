import API from "./axios";

export const getProperties = () => API.get("properties/");
export const getProperty = (id) => API.get(`properties/${id}/`);