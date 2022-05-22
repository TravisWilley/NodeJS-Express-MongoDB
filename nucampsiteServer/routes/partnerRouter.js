const express = require('express');
const Partner = require('../models/partner');
partnerRouter.use(bodyParser.json());

partnerRouter
  .route('/')

  .get((req, res, next) => {
    partner
      .find()
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partner);
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    partner
      .find(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          partner.comments.push(req.body);
          partner
            .save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partner');
  })
  .delete((req, res) => {
    partner
      .find(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          for (let i = partner.comments.length - 1; i >= 0; i--) {
            partner.comments.id(partner.comments[i]._id).remove();
          }
          partner
            .save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

partnerRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    partner
      .findById()
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partner);
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    partner
      .findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          partner.comments.push(req.body);
          partner
            .save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /partner');
  })
  .delete((req, res) => {
    partner
      .findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          for (let i = partner.comments.length - 1; i >= 0; i--) {
            partner.comments.id(partner.comments[i]._id).remove();
          }
          partner
            .save()
            .then((partner) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(partner);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = partnerRouter;
