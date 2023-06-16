import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {hashHistoryRecord} from "@/utils/crypto";

export type ShareResponse = {
    id: string;
};

interface ShareData {
    id: string;
    imageUrl: string;
    hash: string;
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
    const errorMessage = "Failed to share the image";

    try {
        if (!req.body.imageUrl || req.body.hash !== hashHistoryRecord(req.body)) {
            return res.status(500).json(errorMessage);
        }
        // Store the image info in the database
        const response = await insertPhoto(req.body, session.user.email!);
        if (response === null) {
            return res.status(500).json(errorMessage);
        }
        res.status(200).json("success");

    } catch (error) {
        res.status(500).json(errorMessage);
    }
}
