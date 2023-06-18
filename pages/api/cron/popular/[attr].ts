import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/lib/prisma";
import redis from "@/utils/redis";
import {getHeroes} from "@/configs/heroes";

async function listImages(hero: string, take: number, orderBy: string) {
    if (!hero)
        return prisma.image.findMany({
            take: take,
            orderBy: [{[orderBy]: "desc"}],
            select: {id: true, url: true, width: true, height: true},
        });
    else
        return prisma.image.findMany({
            take: take,
            where: {hero: hero},
            orderBy: [{[orderBy]: "desc"}],
            select: {id: true, url: true, width: true, height: true},
        });
}

async function update(attr: string) {
    const numItems = 200;
    const [_, heroAttributes] = getHeroes();

    try {
        if (attr === "all") {
            const images = await listImages("", numItems, "likes");
            if (redis)
                await redis.set("recommend_popular_all", JSON.stringify(images));
        } else {
            const heroes = heroAttributes.get(attr);
            for (const hero of heroes!) {
                const images = await listImages(hero, numItems, "likes");
                if (redis)
                    await redis.set(`recommend_popular_${hero}`, JSON.stringify(images));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { attr } = req.query;
    if (!attr)
        return res.status(500).json("No Attr");
    const attribute = typeof attr === "string"? attr: attr[0];
    await update(attribute);
    return res.status(200).json("success");
}
