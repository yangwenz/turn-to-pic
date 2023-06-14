import redis from "@/utils/redis";
import {Ratelimit} from "@upstash/ratelimit";
import {checkRateLimit} from "@/utils/limit";
import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

export type ShareResponse = {
    id: string;
};

export type ShareData = {
    id: string;
    url: string;
    hash: string;
    width: number;
    height: number;
    hero: string;
    style: string;
    prompt: string;
    negativePrompt: string;
}

interface ShareRequest extends NextApiRequest {
    body: ShareData;
}

const rateLimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.fixedWindow(6, "60 s"),
        analytics: true,
    })
    : undefined;

async function uploadImage(url: string, timeout: number = 10000): Promise<string | null> {
    try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(
            `https://api.upload.io/v2/accounts/${process.env.UPLOAD_ACCOUNT_ID}/uploads/url`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + process.env.UPLOAD_APIKEY,
                },
                body: JSON.stringify({
                    url: url
                }),
                signal: controller.signal
            }
        );
        clearTimeout(id);

        if (response.status === 200) {
            const jsonResponse = await response.json();
            return jsonResponse.fileUrl;
        } else {
            console.log(response);
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

async function insertPhoto(data: ShareData, userId: string) {

}

function isValid(data: ShareData): boolean {
    return true;
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
        return res.status(500).json("Wait for a while");
    }
    const errorMessage = "Failed to share the image";

    try {
        const userId = session.user.email!;
        // Check if the URL in the request is valid
        if (!isValid(req.body)) {
            return res.status(500).json(errorMessage);
        }
        // Upload the image to Upload.io
        const uploadUrl = await uploadImage(req.body.url)
        if (uploadUrl === null) {
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
