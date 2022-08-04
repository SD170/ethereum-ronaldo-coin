import { Client, Entity, Schema, Repository } from "redis-om";

// enrtypoint to interact with the database.
const client = new Client();

const connect = async () => {
    if (!client.isOpen()) {
        try {
            await client.open(process.env.REDIS_URL);
            
        } catch (error) {
            console.error('Error connecting to redis cloud: ', error);
        }
    }
}

export {
    client,
    connect
};