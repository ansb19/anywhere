import axios, { AxiosInstance } from "axios";

export const axiosKapi: AxiosInstance = axios.create({
    baseURL: 'https://kapi.kakao.com',
    timeout: 5000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
})

export const axiosKauth: AxiosInstance = axios.create({
    baseURL: 'https://kauth.kakao.com',
    timeout: 5000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
})

