import { createContext, useReducer, useEffect } from "react"
import { authReducer } from "../reducers/AuthReducer"
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants'
import axios from 'axios'
import setAuthToken from "../../utils/setAuthToken"

export const AuthContext = createContext()

const AuthContextProvider = ({children}) =>{
    const [authState, dispatch] = useReducer(authReducer, {
        authLoading: true,
        isAuthenticated: false,
        user: null
    })

    // Authenticate user (Khi active browser)
    const loadUser = async() => {
        if(localStorage[LOCAL_STORAGE_TOKEN_NAME]){
            setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
        }

        try {
            //- URL này cần verify token
            const response = await axios.get(`${apiUrl}/auth`)
            if(response.data.success){
                
                //- Thấy dispatch là nên nhớ ngay tới Reducer
                dispatch({type: 'SET_AUTH', payload: {isAuthenticated: true, user: response.data.user}})
            }
        } catch (e) {
            // Nếu trong quá trình await có lỗi thì nó sẽ vào chỗ này và return lại các message trong json
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            setAuthToken(null)
            //- Thấy dispatch là nên nhớ ngay tới Reducer
            dispatch({type: 'SET_AUTH', payload: {isAuthenticated: false, user: null}})
        }
    }

    useEffect(() => {
        loadUser()
    }, [])

    // Login
    const loginUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, userForm)
            if(response.data.success){
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
            }

            await loadUser()
            
            return response.data
        } catch (e) {
            //- Nếu response có vấn đề khi await => thì sẽ vào đây
            if(localStorage[LOCAL_STORAGE_TOKEN_NAME]){
                localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            }

            if(e.response.data){
                //- Trả lại các trường hợp sai trên BE
                return e.response.data
            }else{
                //- Trả lại các lỗi ngoài lề khác
                return {success: false, message: e.message}
            }
        }
    }

    // Register
    const registerUser = async (userForm) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/register`, userForm)
            if(response.data.success){
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken)
            }

            await loadUser()
            
            return response.data
        } catch (e) {
            //- Nếu response có vấn đề khi await => thì sẽ vào đây
            if(localStorage[LOCAL_STORAGE_TOKEN_NAME]){
                localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
            }

            if(e.response.data){
                //- Trả lại các trường hợp sai trên BE
                return e.response.data
            }else{
                //- Trả lại các lỗi ngoài lề khác
                return {success: false, message: e.message}
            }
        }
    }

    // Logout
    const logoutUser = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
        dispatch({
            type: 'SET_AUTH', 
            payload: {isAuthenticated: false, user: null
        }})
    }

    // Xuất data
    const authContextData = {loginUser, registerUser, logoutUser, authState}

    // Return Provider
    return (
        <AuthContext.Provider value={authContextData}>
            {children}
        </AuthContext.Provider>
    )
} 

export default AuthContextProvider