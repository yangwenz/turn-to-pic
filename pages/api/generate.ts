import type {NextApiRequest, NextApiResponse} from "next";
import {getServerSession} from "next-auth/next";
import {authOptions} from "./auth/[...nextauth]";
import redis from "@/utils/redis";
import {Ratelimit} from "@upstash/ratelimit";
import {checkRateLimit} from "@/utils/limit";

export type GenerateResponse = {
    endpointUrl: string;
    cancelUrl: string;
    id: string;
};

interface GenerateRequest extends NextApiRequest {
    body: {
        hero: string;
        heroWeight: number;
        prompt: string;
        negativePrompt: string;
        width: number;
        height: number;
        numInferenceSteps: number;
        guidanceScale: number;
        seed: number | string;
        token: string;
    };
}

interface InputData {
    hero: string;
    hero_weight: number;
    prompt: string;
    negative_prompt: string;
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    seed?: number;
}

// Create a new ratelimiter, that allows 20 requests per minute
const rateLimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.fixedWindow(20, "60 s"),
        analytics: true,
    })
    : undefined;

export default async function handler(
    req: GenerateRequest,
    res: NextApiResponse<GenerateResponse | string>
) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
        return res.status(500).json("Please login");
    }
    const success = await checkRateLimit(session, rateLimit, "generate", res);
    if (!success) {
        return;
    }

    try {
        if (!req.body.hero) {
            return res.status(500).json("Please select a Dota2 hero");
        }
        if (req.body.token === undefined || req.body.token === null || req.body.token === "") {
            return res.status(500).json("Please set your Replicate API Key");
        }

        const data: InputData = {
            hero: req.body.hero,
            hero_weight: req.body.heroWeight,
            prompt: req.body.prompt,
            negative_prompt: req.body.negativePrompt,
            width: req.body.width,
            height: req.body.height,
            num_inference_steps: req.body.numInferenceSteps,
            guidance_scale: req.body.guidanceScale
        }
        if (req.body.seed) {
            data.seed = Number(req.body.seed);
        }

        let startResponse = await fetch(
            "https://api.replicate.com/v1/predictions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + req.body.token,
                },
                body: JSON.stringify({
                    version:
                        "22c920af07cfd46d7540374b367953829c68167c395448c8e2a39597480a2d09",
                    input: data,
                }),
            }
        );

        const jsonStartResponse = await startResponse.json();
        if (jsonStartResponse.status === 404) {
            let message = jsonStartResponse.detail;
            message = message + " Please check if your API Key is correct."
            return res.status(500).json(message);

        } else if (jsonStartResponse.status !== 200 && jsonStartResponse.status !== "starting") {
            return res.status(500).json(jsonStartResponse.detail);

        } else {
            res.status(200).json({
                endpointUrl: jsonStartResponse.urls.get,
                cancelUrl: jsonStartResponse.urls.cancel,
                id: jsonStartResponse.id
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json("Failed to generate image");
    }
}
