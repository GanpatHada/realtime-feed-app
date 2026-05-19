const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("connect", () => {
  console.log("Redis Connected");
});

client.on("error", (err) => {
  console.log("Redis Error:", err.message);
});

(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.log(error);
  }
})();

module.exports = client;