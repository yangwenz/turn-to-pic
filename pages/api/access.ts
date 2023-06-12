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
    for (let i = 0; i < 30; i++) {
        try {
            // Loop in 1s intervals until the alt text is ready
            let finalResponse = await fetch(req.body.endpointUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Token " + req.body.token
                },
            });
            const response = await finalResponse.json();

            if (response.status === "succeeded") {
                if (!response.output) {
                    return res.status(502).json("Failed to download the image");
                }
                let imageUrl = response.output[0] as string;
                return res.status(200).json({generated: imageUrl});

            } else if (response.status === "failed") {
                return res.status(501).json("Failed to generate the image");

            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            return res.status(503).json("Failed to generate the image");
        }
    }
    return res.status(500).json("Timeout. Please check the history later.");
}
