import axios, { AxiosInstance } from "axios";

export const axiosKapi: AxiosInstance = axios.create({
    baseURL: 'https://kapi.kakao.com',
    timeout: 5000,
    
})

export const axiosKauth: AxiosInstance = axios.create({
    baseURL: 'https://kauth.kakao.com',
    timeout: 5000,
    
})

