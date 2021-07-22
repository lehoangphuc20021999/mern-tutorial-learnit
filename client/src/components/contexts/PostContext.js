import { createContext, useReducer, useState } from "react"
import { PostReducer } from "../reducers/PostReducer"
import { apiUrl, POSTS_LOADED_SUCCESS, POSTS_LOADED_FAIL, ADD_POST, DELETE_POST, UPDATE_POST, FIND_POST} from './constants'
import axios from 'axios'

export const PostContext = createContext()

const PostContextProvider = ({children}) => {
    // State
    const [postState, dispatch] = useReducer(PostReducer, {
        post: null,
        posts: [],
        postsLoading: true
    })

    const [showAddPostModal, setShowAddPostModal] = useState(false)
    const [showUpdatePostModal, setShowUpdatePostModal] = useState(false)

    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        type: null
    })

    // Get all posts
    const getPosts = async() => {
        try {
            const response = await axios.get(`${apiUrl}/posts`)
            if(response.data.success){
                dispatch({type: POSTS_LOADED_SUCCESS, payload: response.data.posts})
            }
        } catch (e) {
            dispatch({ type: POSTS_LOADED_FAIL})
            // Trả lại lỗi hẳn hoi từ server, chứ không phải lỗi tào lao
            // return e.response.data ? e.response.data : {success: false, message: 'Server error'}
        }   
    }

    // Add post
    const addPost = async newPost =>{
        try {
            const response = await axios.post(`${apiUrl}/posts`, newPost)
            if(response.data.success){
                dispatch({type: ADD_POST, payload: response.data.post})
                //- Chỗ này phải có return nhé
                return response.data
            }
        } catch (e) {
            return e.response.data ? e.response.data : {success: false, message: 'Server error'}
        }
    }

    // Delete post
    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`${apiUrl}/posts/${postId}`)
            if(response.data.success) {
                dispatch({type: DELETE_POST, payload: postId})
            }
        } catch (e) {  
            console.log(e)
        }
    }

	// Find post when user is updating post
	const findPost = postId => {
		const post = postState.posts.find(post => post._id === postId)
		dispatch({ type: FIND_POST, payload: post })
	}

    // Update post
    const updatePost = async updatedPost => {
        try {
            const response = await axios.put(`${apiUrl}/posts/${updatedPost._id}`, updatedPost)
            if(response.data.success){
                dispatch({type: UPDATE_POST, payload: response.data.post})
                return response.data
            }
        } catch (e) {
            return e.response.data ? e.response.data : {success: false, message: 'Server error'}
        }
    }


    // Post context data
    const PostContextData  = {postState, getPosts, showAddPostModal, setShowAddPostModal, addPost, showToast, setShowToast, deletePost, updatePost, findPost, showUpdatePostModal, setShowUpdatePostModal}

    return (
        <PostContext.Provider value={PostContextData}>
            {children}
        </PostContext.Provider>
    )
}

export default PostContextProvider
