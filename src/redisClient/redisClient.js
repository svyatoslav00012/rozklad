const redisClient = require("redis");
const Config = require("../Config");
const { promisify } = require("util");

const client = redisClient.createClient(Config.redis);

client.on("error", function(error) {
    console.error(error);
});

client.getAsync = promisify(client.get)
// client.getJsonAsync = async key => promisify(client.get)(key).then(JSON.parse)
client.setAsync = promisify(client.set)
client.hmsetAsync = promisify(client.hmset)
client.hgetallAsync = promisify(client.hgetall)
client.hgetAsync = promisify(client.hget)
client.hincrbyAsync = promisify(client.hincrby)
// client.setJsonAsync = async (key, body) => promisify(client.set)(key, JSON.stringify(body))
// client.setJsonExpAsync = async (key, exp, body) => promisify(client.setex)(key, exp, JSON.stringify(body))
// client.delAsync = promisify(client.del)

module.exports = client