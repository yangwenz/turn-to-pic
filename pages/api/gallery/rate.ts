import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

interface RateRequest extends NextApiRequest {
    body: {
        imageId: string
    };
}

async function insertRating(userId: string, imageId: string) {
    return await prisma.$transaction([
        prisma.rating.create({
            data: {
                userId: userId,
                imageId: imageId,
                rating: 1
            },
        }),
        prisma.image.update({
            where: {
                id: imageId
            },
            data: {
                likes: {increment: 1}
            },
        })
    ]).catch(async (e) => {
        return null;
    })
}

export default async function handler(
    req: RateRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.email) {
        return res.status(500).json("Please login");
    }
    try {
        const r = await insertRating(session.user.email!, req.body.imageId)
        if (r === null) {
            return res.status(500).json("Rating failed");
        }
        res.status(200).json(r[0]);
    } catch (error) {
        res.status(500).json("Rating failed");
    }
}
