import prisma from "@/lib/prisma";
import {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/pages/api/auth/[...nextauth]";

interface GetImageRequest extends NextApiRequest {
    body: {
        id: string,
        onlyUrl: boolean
    };
}

export type GetImageResponse = {
    id: string;
    imageUrl?: string;
    width?: number;
    height?: number;
    hero?: string;
    heroWeight?: number;
    style?: string;
    styleWeight?: number;
    prompt?: string;
    negativePrompt?: string;
    numInferenceSteps?: number;
    guidanceScale?: number;
}

export default async function handler(
    req: GetImageRequest,
    res: NextApiResponse<GetImageResponse | string>
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(500).json("Please login");
    }
    try {
        const image = await prisma.image.findUnique({
            where: {id: req.body.id}
        });
        if (image === null) {
            res.status(200).json({id: "", imageUrl: ""});
        } else {
            if (req.body.onlyUrl)
                res.status(200).json({
                    id: image.id,
                    imageUrl: image.url
                });
            else
                res.status(200).json({
                    id: image.id,
                    imageUrl: image.url,
                    width: image.width,
                    height: image.height,
                    hero: image.hero,
                    heroWeight: image.heroWeight,
                    style: image.style,
                    styleWeight: image.styleWeight,
                    prompt: image.prompt,
                    negativePrompt: image.negativePrompt,
                    numInferenceSteps: image.numInferenceSteps,
                    guidanceScale: image.guidanceScale
                });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json("Failed to get image info");
    }
}
