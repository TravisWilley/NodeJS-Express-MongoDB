const express = require('express');
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const partnerRouter = express.Router();

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.find(req.user._id)
      .populate('user')
      .populate('campsites')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.user = req.user._id;
          favorite.favorites.push(req.body);
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({ user: req.user._id }).then((favorite) => {
            req.body.forEach((fav) => {
              if (!favorite.campsites.includes(fav._id)) {
                favorite.campsites.push(fav._id);
              }
            });
            favorite.save().then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            });
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`PUT operation not supported on /favorites`);
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOneAndDelete()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
          res.end('You do not have any favorites to delete.');
        })
        .catch((err) => next(err));
    }
  );

favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find(req.user._id)
      .populate('user.campsites')
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
        res.statusCode = 403;
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.user = req.user._id;
          favorite.favorites.push(req.body);
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(favorite);
            })
            .catch((err) => next(err));
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: req.user._id,
          });
        }
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(`PUT operation not supported on /favorites`);
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
          if (Favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if (index >= 0) {
              favorite.campsites.splice(index, 1);
            }

            favorite.save().then((favorite) => {
              console.log('Favorite Campsite Deleted!', favorite);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(Favorite);
            });
          }
        })
        .catch((err) => next(err));
    }
  );

module.exports = favoriteRouter;
