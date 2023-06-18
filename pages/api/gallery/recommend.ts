import redis from "@/utils/redis";
import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

interface RecommendRequest extends NextApiRequest {
    body: {
        type: string,
        hero: string,
        skip: number,
        take: number
    };
};

export type RecommendItem = {
    id: string,
    url: string,
    width: number,
    height: number,
};

export default async function handler(
    req: RecommendRequest,
    res: NextApiResponse<RecommendItem[] | string>
){
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(500).json("Please login");
    }
    if (!redis) {
        return res.status(500).json("System error, please try again later.");
    }

    try {
        const r = await redis.lrange(
            `recommend_${req.body.type}_${req.body.hero}`,
            req.body.skip,
            req.body.skip + Math.max(0, req.body.take - 1)
        );
        // @ts-ignore
        return res.status(200).json(r);

    } catch (error) {
        console.log(error);
        res.status(500).json("System error, please try again later.");
    }
}
