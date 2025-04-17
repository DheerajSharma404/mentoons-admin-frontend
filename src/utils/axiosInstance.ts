import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});
const axiosConfig = () => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
    )
}

const axiosResponse = ()=>{axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);
}

export {axiosInstance,axiosConfig,axiosResponse};