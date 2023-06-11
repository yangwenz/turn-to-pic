import {Session} from "next-auth";
import {Ratelimit} from "@upstash/ratelimit";
import {NextApiResponse} from "next";

export async function checkRateLimit(
    session: Session, rateLimit: Ratelimit | undefined, prefix: string, res: NextApiResponse
) {
    if (rateLimit) {
        const identifier = session.user?.email;
        const result = await rateLimit.limit(`${identifier!}_${prefix}`);
        res.setHeader("X-RateLimit-Limit", result.limit);
        res.setHeader("X-RateLimit-Remaining", result.remaining);
        if (!result.success) {
            res.status(429).json("Too many requests, please try again later.");
            return false;
        }
    }
    return true;
}
