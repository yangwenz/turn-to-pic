import {NextApiRequest, NextApiResponse} from "next";

export type AccessResponse = {
    generated: string;
};

interface AccessRequest extends NextApiRequest {
    body: {
        endpointUrl: string;
        token: string;
    };
}

export default async function handler(
    req: AccessRequest,
    res: NextApiResponse<AccessResponse | string>
) {
    let i: number = 0;
    let generatedImage: string | null = null;
    const errorMessage =
        "Failed to get image. Please check the history later.";

    while (!generatedImage && i < 180) {
        try {
            // Loop in 1s intervals until the alt text is ready
            let finalResponse = await fetch(req.body.endpointUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + req.body.token
                },
            });
            const jsonFinalResponse = await finalResponse.json();
            if (jsonFinalResponse.status === "succeeded") {
                if (!jsonFinalResponse.output) {
                    return res.status(500).json("Failed to get image");
                }
                generatedImage = jsonFinalResponse.output[0] as string;
            } else if (jsonFinalResponse.status === "failed") {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                i += 1;
            }
        } catch (error) {
            return res.status(500).json(errorMessage);
        }
    }
    if (!generatedImage) {
        return res.status(500).json(errorMessage);
    }
    res.status(200).json(
        generatedImage? {generated: generatedImage}: errorMessage
    );
}
