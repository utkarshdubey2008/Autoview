const MEASUREMENT_ID = "GA4481222861"; // Your Google Analytics Measurement ID
const CLIENT_ID = "123456"; // Random unique ID
const WEBSITE_URL = "https://rapidx.me"; // Your main website

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/viewcount") {
      // Show the total number of views sent
      let count = await env.VIEW_COUNT.get("total") || "0";
      return new Response(`📊 Total Views Sent: ${count}`, { status: 200 });
    }

    if (url.pathname.startsWith("/sendview")) {
      let totalViews = (await env.VIEW_COUNT.get("total")) || "0";
      totalViews = parseInt(totalViews) + 1;
      await env.VIEW_COUNT.put("total", totalViews.toString());

      // Extract the redirect page from the query parameter
      let redirectPath = url.searchParams.get("path") || "/";
      let fullRedirectURL = `${WEBSITE_URL}${redirectPath}`;

      // Send page view to Google Analytics
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&client_id=${CLIENT_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events: [{ name: "page_view" }] }),
      });

      // Redirect user to the requested page
      return Response.redirect(fullRedirectURL, 302);
    }

    return new Response("❌ Invalid endpoint", { status: 404 });
  }
};
