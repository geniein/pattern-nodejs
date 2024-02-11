"use strict";

const redis = require("redis");
const redisClient = redis.createClient();

const STREAMS_KEY = "sk01";
const APPLICATION_ID = "iot_app";
const CONSUMER_ID = "consumer:1";

async function main() {
  await redisClient.connect();
  // create the group
  try {
    await redisClient.xGroupCreate(STREAMS_KEY, APPLICATION_ID, "$", {
      MKSTREAM: true,
    });
  } catch (e) {
    console.log(e);
  }

  while (true) {
    let response = await redisClient.xReadGroup(
      APPLICATION_ID,
      CONSUMER_ID,
      {
        key: STREAMS_KEY,
        id: ">",
      },
      { BLOCK: 500, COUNT: 1 }
    );
    if (response) {
      console.log(JSON.stringify(response));
      const entryId = response[0].messages[0].id;
      await redisClient.xAck(STREAMS_KEY, APPLICATION_ID, entryId);
    } else {
      console.log("No new stream entries.");
    }
  }
}

main();
