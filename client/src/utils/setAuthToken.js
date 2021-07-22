import axios from 'axios'

//- Set mặc định kèm theo Authorization ở Header
//- Token được lấy từ localStorage
const setAuthToken = (token) => {
    if(token){
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }else{
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthToken