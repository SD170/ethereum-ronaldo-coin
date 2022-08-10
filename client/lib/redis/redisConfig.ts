import { Client, Entity, Schema, Repository } from "redis-om";

// enrtypoint to interact with the database.
const client = new Client();

const connect = async () => {
    console.log("sssssssssssssssssssssssssssssssssssssssssssss");
    console.log("sssssssssssssssssssssssssssssssssssssssssssss");
    console.log("client.isOpen() ", client.isOpen());
    console.log("sssssssssssssssssssssssssssssssssssssssssssss");
    console.log("sssssssssssssssssssssssssssssssssssssssssssss");
    if (!client.isOpen()) {
        try {
            await client.open(process.env.REDIS_URL_LOCAL);
            
        } catch (error) {
            console.error('Error connecting to redis cloud: ', error);
        }
    }
}

export {
    client,
    connect
};