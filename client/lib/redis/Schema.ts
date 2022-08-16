import { Client, Entity, Schema, Repository } from "redis-om";

class Owner extends Entity { };

const schema = new Schema(
    Owner,
    {
        address: { type: 'string' },
        name: { type: 'string' },
        note: { type: 'string' },
        createdAt: { type: 'string', sortable:true },
        // createdAtLocal: { type:'string' }
    }, {
    dataStructure: 'JSON'
}
)

export { schema, Owner };