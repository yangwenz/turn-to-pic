import redis from "@/utils/redis";
import {Ratelimit} from "@upstash/ratelimit";
import {checkRateLimit} from "@/utils/limit";
import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export type ShareResponse = {
    id: string;
};

interface ShareData {
    id: string;
    imageUrl: string;
    width: number;
    height: number;
    hero: string;
    heroWeight: number;
    style: string;
    styleWeight: number;
    prompt: string;
    negativePrompt: string;
    numInferenceSteps: number;
    guidanceScale: number;
}

interface ShareRequest extends NextApiRequest {
    body: ShareData;
}

const rateLimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.fixedWindow(5, "60 s"),
        analytics: true,
    })
    : undefined;

async function insertPhoto(data: ShareData, userId: string) {

}

export default async function handler(
    req: ShareRequest,
    res: NextApiResponse<ShareResponse | string>
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(500).json("Please login");
    }
    const success = await checkRateLimit(session, rateLimit, "share", res);
    if (!success) {
        return res.status(501).json("Exceed the sharing limit");
    }
    const errorMessage = "Failed to share the image";

    try {
        const userId = session.user.email!;
        if (!req.body.imageUrl) {
            return res.status(500).json(errorMessage);
        }
        // Store the image info in the database
        const response = await insertPhoto(req.body, userId);
        if (response === null) {
            return res.status(500).json(errorMessage);
        }
        res.status(200).json("success");

    } catch (error) {
        res.status(500).json(errorMessage);
    }
}
