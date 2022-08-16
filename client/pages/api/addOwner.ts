import { NextApiRequest, NextApiResponse } from "next";
import { createOwner } from "../../lib/redis/services";



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {

        const id = await createOwner(req.body);
        res.status(200).json({ id })
    }
}