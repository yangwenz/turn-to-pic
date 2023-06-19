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

export async function updateRecommendation(attr: string, type: string) {
    const numItems = 200;
    const [_, heroAttributes] = getHeroes();
    const orderBy = type == "popular"? "likes": "createdAt";

    try {
        if (attr === "all") {
            const images = await listImages("", numItems, orderBy);
            if (redis && images.length > 0) {
                const values = images.map(image => JSON.stringify(image));
                await redis.del(`recommend_${type}_all`);
                await redis.rpush(`recommend_${type}_all`, ...values);
            }
        } else {
            const heroes = heroAttributes.get(attr);
            for (const hero of heroes!) {
                const images = await listImages(hero, numItems, orderBy);
                if (redis && images.length > 0) {
                    const values = images.map(image => JSON.stringify(image));
                    await redis.del(`recommend_${type}_${hero}`);
                    await redis.rpush(`recommend_${type}_${hero}`, ...values);
                }
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
