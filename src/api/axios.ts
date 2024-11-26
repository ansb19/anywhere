import axios from "axios";


export const axiosKakaoToken = axios.create({
    baseURL: 'https://kauth.kakao.com/oauth/token',
    timeout: 5000,

})

export const axiosKakaoInfo = axios.create({
    baseURL: 'https://kapi.kakao.com/v2/user/me',
    timeout: 5000
})