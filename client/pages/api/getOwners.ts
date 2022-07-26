import { NextApiRequest, NextApiResponse } from "next";
import { getOwners } from "../../lib/redis/services";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {

        try {
            const owners = await getOwners();
            res.status(200).json(owners);
            
        } catch (error) {
            console.log(error);
        }
    }
}