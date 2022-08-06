import { NextApiRequest, NextApiResponse } from "next";
import { ownerData } from "../../interfaces";
import { getOwners } from "../../lib/redis/services";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {

        const owners = await getOwners();
        res.status(200).json(owners);
    }
}