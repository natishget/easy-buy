import axios from 'axios';

const api = axios.create({
    baseURL: "https://easy-buy-qa2t.onrender.com",
    // withCredentials: true,
});

// const api = axios.create({
//     baseURL: "http://localhost:3001",
//     // withCredentials: true,
// });

export default api