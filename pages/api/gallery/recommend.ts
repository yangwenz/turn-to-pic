import redis from "@/utils/redis";
import prisma from "@/lib/prisma";
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
}

export type RecommendItem = {
    id: string,
    url: string,
    width: number,
    height: number,
    likes?: number,
    userLiked?: boolean
};

async function queryLikes(items: RecommendItem[]) {
    if (items.length === 0)
        return items;

    try {
        let newItems = [...items];
        const ids = items.map(item => item.id);
        const likes = await prisma.image.findMany({
            where: {
                id: {in: ids}
            },
            select: {
                id: true, likes: true
            },
        });
        const id2likes = new Map<string, number>(
            likes.map(x => [x.id, x.likes])
        );
        for (let i = 0; i < newItems.length; i++) {
            newItems[i].likes = id2likes.get(newItems[i].id) || 0;
        }
        return newItems;

    } catch (e) {
        console.log(e);
        return items;
    }
}

async function queryUserLiked(userId: string, items: RecommendItem[]) {
    if (items.length === 0)
        return items;

    try {
        let newItems = [...items];
        const ids = items.map(item => item.id);
        const ratings = await prisma.rating.findMany({
            where: {
                userId: userId,
                imageId: {in: ids}
            },
            select: {
                imageId: true, rating: true
            },
        })
        const id2ratings = new Map<string, number>(
            ratings.map(x => [x.imageId, x.rating])
        );
        for (let i = 0; i < newItems.length; i++) {
            const rating = id2ratings.get(newItems[i].id) || 0;
            newItems[i].userLiked = rating > 0;
        }
        return newItems;

    } catch (e) {
        console.log(e);
        return items;
    }
}

export default async function handler(
    req: RecommendRequest,
    res: NextApiResponse<RecommendItem[] | string>
) {
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
        let items = await queryLikes(r);
        items = await queryUserLiked(session.user.email!, items);
        return res.status(200).json(items);

    } catch (e) {
        console.log(e);
        res.status(500).json("System error, please try again later.");
    }
}
