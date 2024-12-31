import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url";

export const findTweetById = async (id: number) => {
    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select: {
                    userSlug: true
                }
            }
        },
        where: { id }
    });

    if (tweet) {
        tweet.user.avatar = getPublicUrl(tweet.user.avatar);
        return tweet;
    }

    return null;
}

interface CreateTweet {
    slug: string;
    body: string;
    answer?: number;
}

export const createTweet = async ({ slug, body, answer }: CreateTweet) => {
    const newTweet = await prisma.tweet.create({
        data: {
            body,
            userSlug: slug,
            answerOf: answer ?? 0
        }
    });

    return newTweet;
}