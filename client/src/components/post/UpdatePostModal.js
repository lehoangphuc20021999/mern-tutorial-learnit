import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { useContext } from 'react';
import { PostContext } from '../contexts/PostContext';

const UpdatePostModal = props => {
    // Contexts
    const {
        postState: {post},
        showUpdatePostModal,
        setShowUpdatePostModal,
        updatePost,
        setShowToast} = useContext(PostContext)

    // State
    const [updatedPost, setUpdatedPost] = useState(post)

    useEffect(() => setUpdatedPost(post), [post])

    const {title, description, url, status} = updatedPost

    const onChangeUpdatedPostForm = (e) => {
        setUpdatedPost({
            ...updatedPost, [e.target.name]: e.target.value
        })
    }

	const closeDialog = () => {
		setUpdatedPost(post)
		setShowUpdatePostModal(false)
	}

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const {success, message} = await updatePost(updatedPost)
            setShowUpdatePostModal(false)
            setShowToast({show: true, message, type: success ? 'success' : 'danger'})
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Modal show={showUpdatePostModal} onHide={closeDialog}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Making progress?
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
                            onChange={onChangeUpdatedPostForm}
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
                            onChange={onChangeUpdatedPostForm}
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
                        onChange={onChangeUpdatedPostForm}
                        ></Form.Control>
                        <Form.Text id="title-help" muted>Required</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as='select' value={status} name="status" onChange={onChangeUpdatedPostForm}>
                            <option value="TO LEARN">TO LEARN</option>
                            <option value="LEARNING">LEARNING</option>
                            <option value="LEARNED">LEARNED</option>
                        </Form.Control>
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

export default UpdatePostModal;