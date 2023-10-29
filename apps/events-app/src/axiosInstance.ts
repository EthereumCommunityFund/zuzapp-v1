import axios, { AxiosInstance } from 'axios';
import Router from 'next/router';



const axiosInstance: AxiosInstance = axios.create({
    // baseURL: 'https://zuzapp-v1-events-app-delta.vercel.app', // replace with your API endpoint
    baseURL: "http://localhost:3001",
    headers: {
        'Content-Type': 'application/json',
    },
});





// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Do something with the response data
        return response;
    },
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    Router.push('/')
                    break;
                // case 403:

                //     alert('Forbidden. You do not have permission.');
                //     break;
                // case 500:

                //     alert('Server error. Please try again later.');
                //     break;
                // default:

                //     alert('Something went wrong.');
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
