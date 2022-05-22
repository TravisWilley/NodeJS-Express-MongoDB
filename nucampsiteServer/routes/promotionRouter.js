const express = require('express');
const Promotion = require('../models/promotion');
promotionRouter.use(bodyParser.json());

promotionRouter
  .route('/')

  .get((req, res, next) => {
    Promotion.find()
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion);
        } else {
          err = new Error(`promotion ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.findById(req.params.PromotionId)
      .then((Promotion) => {
        if (Promotion) {
          Promotion.comments.push(req.body);
          Promotion.save()
            .then((Promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(Promotion);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Promotion ${req.params.PromotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Promotion');
  })
  .delete((req, res) => {
    Promotion.findById(req.params.PromotionId)
      .then((Promotion) => {
        if (Promotion) {
          for (let i = Promotion.comments.length - 1; i >= 0; i--) {
            Promotion.comments.id(Promotion.comments[i]._id).remove();
          }
          Promotion.save()
            .then((Promotion) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(Promotion);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Promotion ${req.params.PromotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

promotionRouter
  .route('/:promotionId')
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
  })

  .get((req, res, next) => {
    Promotion.findByID(req.params.promotionId)
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion);
        } else {
          err = new Error(`promotion ${req.params.promotionId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotion/${req.params.promotionId}`
    );
  })
  .put((req, res) => {
    res.write(`Updating the promotion: ${req.params.promotionId}\n`);
    res.end(`Will update the promotion: ${req.body.name}
        with description: ${req.body.description}`);
  })
  .delete((req, res) => {
    res.end(`Deleting promotion: ${req.params.promotionId}`);
  });

module.exports = promotionRouter;
