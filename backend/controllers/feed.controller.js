const Feed = require("../models/Feed");
const redisClient = require("../config/redis");

exports.getFeeds = async (req, res) => {
  try {
    const cachedFeeds = await redisClient.get("feeds");

    if (cachedFeeds) {
      console.log('from cache');
      return res.json(JSON.parse(cachedFeeds));
    }

    console.log('without cache');
    const feeds = await Feed.find().sort({ createdAt: -1 });

    await redisClient.set("feeds", JSON.stringify(feeds));

    res.json(feeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFeed = (io) => async (req, res) => {
  try {
    const { message } = req.body;

    const newFeed = await Feed.create({
      message,
    });

    // clear cache
    await redisClient.del("feeds");

    // realtime emit
    io.emit("new-feed", newFeed);

    res.status(201).json(newFeed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
