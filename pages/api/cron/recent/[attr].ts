import {NextApiRequest, NextApiResponse} from "next";
import {updateRecommendation} from "@/pages/api/cron/utils";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { attr } = req.query;
    if (!attr)
        return res.status(500).json("No Attr");
    const attribute = typeof attr === "string"? attr: attr[0];
    const success = await updateRecommendation(attribute, "recent", 300);
    if (success)
        return res.status(200).json("success");
    else
        return res.status(500).json("failed");
}
