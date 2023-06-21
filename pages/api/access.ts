import {NextApiRequest, NextApiResponse} from "next";

export type AccessResponse = {
    generated: string;
};

interface AccessRequest extends NextApiRequest {
    body: {
        endpointUrl: string;
        token: string;
        numTrials: number;
    };
}

export default async function handler(
    req: AccessRequest,
    res: NextApiResponse<AccessResponse | string>
) {
    let n = Math.min(req.body.numTrials, 30);
    for (let i = 0; i < n; i++) {
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
                return res.status(200).json({generated: response.output[0] as string});

            } else if (response.status === "failed") {
                return res.status(501).json("Failed to generate the image");

            } else {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        } catch (error) {
            // Parsing the response fails sometimes
            console.log(error);
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
    return res.status(500).json(
        "Timeout. Please check the history later and click Refresh.");
}
