import { Repository } from "redis-om";
import { schema, Owner } from "./Schama";
import { connect, client } from "./redisConfig";



// @ts-ignore
export const createOwner = async (data) => {
    // connect if not connected
    await connect();

    // @ts-ignore
    const repository = new Repository<Owner>(schema, client);

    const owner = repository.createEntity(data);

    // id = <uniqueId>
    const id = await repository.save(owner);


    // key for the data in redis is:
    // key = Owner:<uniqueId>

    return id;
}


export const getOwners = async () => {
    // connect if not connected
    await connect();

    // @ts-ignore
    const repository = new Repository<Owner>(schema, client);

    // need to build index to search [drop index if the schema is updated]
    try {
        await repository.dropIndex();
        await repository.createIndex();
    } catch (error) {
        console.log('error indexing in redis ', error);
    }

    

    const owners = await repository.search().return.all();

    return owners;
}