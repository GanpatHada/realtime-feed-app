const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed.controller");

module.exports = (io) => {
  // GET FEEDS
  router.get("/", feedController.getFeeds);

  // POST FEED
  router.post("/", feedController.createFeed(io));

  return router;
};
