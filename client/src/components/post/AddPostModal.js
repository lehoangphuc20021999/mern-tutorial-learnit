import React, { useState } from 'react';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useContext } from 'react';
import { PostContext } from '../contexts/PostContext';

const AddPostModal = props => {
    // Contexts
    const {showAddPostModal, setShowAddPostModal, addPost, setShowToast} = useContext(PostContext)

    // State
    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        url: '',
        status: 'TO LEARN'
    })

    const {title, description, url} = newPost

    const onChangeNewPostForm = (e) => {
        setNewPost({
            ...newPost, [e.target.name]: e.target.value
        })
    }

    const closeDialog = () =>{
        resetAddPostData()
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const {success, message} = await addPost(newPost)
            resetAddPostData()
            setShowToast({show: true, message, type: success ? 'success' : 'danger'})
        } catch (e) {
            console.log(e);
        }
    }

    const resetAddPostData = () => {
        setNewPost({title: '', description: '', url: '', status: 'TO LEARN'})
        setShowAddPostModal(false) 
    } 

    return (
        <Modal show={showAddPostModal} animation={false} onHide={closeDialog}>
            <Modal.Header closeButton>
                <Modal.Title>
                    What do you want to learn?
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Control 
                            type="text" 
                            placeholder="Title" 
                            name="title" 
                            required 
                            aria-describedby="title-help"
                            value={title}
                            onChange={onChangeNewPostForm}
                        ></Form.Control>
                        <Form.Text id="title-help" muted>Required</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                            as="textarea" 
                            placeholder="Description" 
                            name="description" 
                            row={3} 
                            required 
                            aria-describedby="title-help"
                            value={description}
                            onChange={onChangeNewPostForm}
                        ></Form.Control>
                        <Form.Text id="title-help" muted>Required</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control 
                        type="text" 
                        placeholder="Youtube 
                        Tutorial URL" 
                        name="url"
                        value={url}
                        onChange={onChangeNewPostForm}
                        ></Form.Control>
                        <Form.Text id="title-help" muted>Required</Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={closeDialog}>Cancel</Button>
                <Button variant="primary" type="submit">LearnIt</Button>
            </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default AddPostModal;