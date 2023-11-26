// Create web server using Express
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Comments = require('../models/comments');
const commentRouter = express.Router();

commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => { // get all comments
    Comments.find(req.query) // find all comments
    .populate('author')
    .then((comments) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comments); // return all comments
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // post new comment
    Comments.create(req.body) // create new comment
    .then((comment) => {
        console.log('Comment Created ', comment);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(comment); // return new comment
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // put all comments
    res.statusCode = 403;
    res.end('PUT operation not supported on /comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // delete all comments
    Comments.remove({}) // remove all comments
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); // return response
    }, (err) => next(err))
    .catch((err) => next(err));
});

commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => { // get comment by id
    Comments.findById(req.params.commentId) // find comment by id
    .populate('author')
    .then((comment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type