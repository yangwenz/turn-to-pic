import type {NextRequest} from "next/server"
import {ipAddress} from "@vercel/edge";
import redis from "@/utils/redis";
import {Ratelimit} from "@upstash/ratelimit";

export const config = {
    matcher: "/api/gallery/:path*",
};

const rateLimit = redis
    ? new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(120, "60 s"),
        analytics: true,
        timeout: 2000
    })
    : undefined;

function ipFallback(request: Request) {
    const xff = request.headers.get("x-forwarded-for");
    return xff
        ? Array.isArray(xff)
            ? (xff[0] as string)
            : xff.split(",")[0]
        : "127.0.0.1";
}

async function shouldLimitRate(request: NextRequest) {
    const ip = ipAddress(request) || ipFallback(request);
    if (!ip) {
        return false;
    }
    if (rateLimit) {
        const result = await rateLimit.limit(ip);
        if (!result.success) {
            return true;
        }
    }
    return false;
}

export async function middleware(request: NextRequest) {
    if (await shouldLimitRate(request)) {
        return new Response("Too many requests, please try again later.", {
            status: 429,
        });
    }
}
