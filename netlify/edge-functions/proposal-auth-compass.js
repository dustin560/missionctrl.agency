/**
 * Edge Function: Basic Auth for /proposals/compassgroup/*
 *
 * Password is read from the Netlify environment variable:
 *   PROPOSAL_PASSWORD_COMPASS
 *
 * Set it in: Netlify dashboard → Site configuration →
 * Environment variables → Add a variable.
 *
 * Any username works — only the password is checked.
 */

export default async (request, context) => {
  // ------------------------------------------------------------------
  // 1. Read the password from the Netlify env var.
  //    Deno.env.get is the standard API in Netlify Edge Functions.
  // ------------------------------------------------------------------
  let password;
  try {
    password = Deno.env.get("PROPOSAL_PASSWORD_COMPASS");
  } catch (e) {
    console.error("[proposal-auth-compass] Deno.env.get failed:", e && e.message);
    return new Response(
      "Configuration error — contact hello@missionctrl.agency",
      { status: 503, headers: { "content-type": "text/plain" } }
    );
  }

  if (!password) {
    console.error("[proposal-auth-compass] PROPOSAL_PASSWORD_COMPASS env var is not set.");
    return new Response(
      "Access not configured — contact hello@missionctrl.agency",
      { status: 503, headers: { "content-type": "text/plain" } }
    );
  }

  // ------------------------------------------------------------------
  // 2. Check the Authorization header the browser sends after the user
  //    enters their password in the native Basic Auth dialog.
  // ------------------------------------------------------------------
  const authHeader = request.headers.get("authorization") || "";

  if (authHeader.startsWith("Basic ")) {
    let providedPassword = "";
    try {
      const decoded = atob(authHeader.slice(6));
      const colon = decoded.indexOf(":");
      providedPassword = colon >= 0 ? decoded.slice(colon + 1) : decoded;
    } catch (e) {
      console.error("[proposal-auth-compass] atob decode failed:", e && e.message);
    }

    if (providedPassword === password) {
      // Correct password — pass through to the static file.
      return context.next();
    }
  }

  // ------------------------------------------------------------------
  // 3. No auth header or wrong password — challenge the browser.
  //    The browser will pop a native "sign in" dialog.
  // ------------------------------------------------------------------
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Compass Group Proposal", charset="UTF-8"',
      "Cache-Control": "no-store",
      "content-type": "text/plain",
    },
  });
};

export const config = {
  // Covers /proposals/compassgroup (no slash), /proposals/compassgroup/ and
  // everything beneath it (assets, sub-paths, etc.)
  path: ["/proposals/compassgroup", "/proposals/compassgroup/*"],
};
