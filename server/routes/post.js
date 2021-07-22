const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Post = require('../models/Post')


// @route GET api/posts
// @desc Get all posts
// @access Private
router.get('/', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({user: req.userId}).populate('user', ['username'])
        res.json({success: true, posts})
    } catch (e) {
        console.log(e.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async(req, res) => {
    const {title, description, url, status} = req.body

    // Simple validation
    if(!title){
        return res.status(400).json({success: false, message: 'Title is required'})
    }

    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('http://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })

        await newPost.save()

        return res.json({success: true, message: 'Happy learning!', post: newPost})
    } catch (e) {
        console.log(e.message)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route GET api/posts
// @desc Get post
// @access Private
router.put('/:id', verifyToken, async(req, res) => {
    const {title, description, url, status} = req.body

    // Simple validation
    if(!title){
        return res.status(400).json({success: false, message: 'Title is required'})
    }

    try {
        let updatedPost = {
            title,
            description: description || '',
            url: url.startsWith('http://') ? url : `https://${url}`,
            status: status || 'TO LEARN'
        }

        const postUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})

        // User not authorised to update post
        if(!updatedPost){
            return res.status(401).json({success: false, message: 'Post not found or user not authorised'})
        }

        res.json({success: true, message: 'Excellent progress!', post: updatedPost})
    } catch (e) {
        console.log(e.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async(req, res) =>{
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId}
        const deletePost = await Post.findOneAndDelete(postDeleteCondition)

        // User not authorised or post not found
        if(!deletePost){
            return res.status(401).json({
                success: false,
                message: 'Post not found or user not authorised'
            })
        }

        res.json({success: true, post: deletePost })
    } catch (e) {
        console.log(e.message)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})
module.exports = router