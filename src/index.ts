import { Hono, HonoRequest } from "hono";

/**
 * Type definition for the KV Namespaces.
 */
type KVNamespaces = {
    [key: string]: KVNamespace;
};

/**
 * Type definition for the environment variables.
 */
type Env = KVNamespaces & {
    HOST_URL: string;
    HOST_DOMAIN: string;
    LINK_KV_BINDING: string;
    STATUS_PAGE_URL: string;
    DEFAULT_LOCATION: string;
};

/**
 * Represents the structure of the analytics data.
 */
type AnalyticsData = {
    name: string;
    url: string;
    domain: string;
    referrer?: string;
};

/**
 * Logs analytics data for each request.
 *
 * @param request - The incoming HTTP request.
 * @param slug - The slug from the URL.
 * @param destination - The destination URL.
 * @param env - The environment variables.
 */
const logAnalytics = async (
    request: HonoRequest,
    slug: string,
    destination: string,
    env: Env,
) => {
    const userAgent = request.header("User-Agent") ?? "Unknown User Agent";
    const ip = request.header("CF-Connecting-IP") ?? "Unknown IP";
    const referrer = request.header("Referer") ?? undefined;

    const analyticsData: AnalyticsData = {
        name: "pageview",
        url: `${env.HOST_URL}/${slug}`,
        domain: `${env.HOST_DOMAIN}`,
        referrer,
    };

    const analyticsRequest = new Request("https://plausible.io/api/event", {
        method: "POST",
        headers: {
            "User-Agent": userAgent,
            "X-Forwarded-For": ip,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(analyticsData),
    });

    try {
        await fetch(analyticsRequest);
    } catch (error) {
        console.error("Error logging to Plausible:", error);
    }
};

// Initialize a new Hono app.
const app = new Hono();

/**
 * Route handler for GET requests with a slug.
 */
app.get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const env: Env = c.env as Env;
    const kvNamespaceName = env.LINK_KV_BINDING;

    if (!kvNamespaceName || !env[kvNamespaceName]) {
        return c.text(
            // biome-ignore lint/style/useTemplate: This is a ternary expression.
            "You broke it!" + env.STATUS_PAGE_URL ??
                ` Check for outages on ${env.STATUS_PAGE_URL}`,
            500,
        );
    }

    const kvNamespace = env[kvNamespaceName] as KVNamespace;
    const destination = await kvNamespace.get(slug);

    if (destination) {
        await logAnalytics(c.req, slug, destination, env);
        return c.redirect(destination, 301);
    }
    return c.redirect("https://cyber.info", 302);
});

// Handler for not found routes.
app.notFound((c) => {
    return c.redirect("https://cyber.info", 302);
});

export default app;
