/**
 * Edge Function: Per-client Basic Auth for /proposals/<slug>/*
 *
 * Each client has their own Netlify environment variable:
 *   PROPOSAL_PASSWORD_<SLUG>  (e.g. PROPOSAL_PASSWORD_SOLMAX)
 *
 * The password is read from the env var. Any username works. If no env var
 * is configured for the slug, access is denied (fail-closed, 503).
 *
 * Set env vars in: Netlify dashboard → Site configuration →
 *   Environment variables → Add a variable.
 */

export default async (request, context) => {
  try {
    const url = new URL(request.url);

    // Extract the client slug from /proposals/{slug}/...
    const match = url.pathname.match(/^\/proposals\/([^\/]+)/);
    if (!match) return context.next();
    const slug = match[1];

    // Look up per-client password from a Netlify env var.
    // Netlify.env.get is the supported API; fall back to Deno.env.get
    // if the runtime ever differs.
    const envKey = `PROPOSAL_PASSWORD_${slug.toUpperCase().replace(/-/g, "_")}`;
    const expectedPassword = readEnv(envKey);

    // Fail closed: no env var, no access.
    if (!expectedPassword) {
      return new Response(
        [
          "Access to this proposal has not been configured.",
          "",
          "Please contact MissionCTRL (hello@missionctrl.agency).",
          "",
          `(Site owner: set the "${envKey}" environment variable in Netlify.)`,
        ].join("\n"),
        {
          status: 503,
          headers: { "content-type": "text/plain; charset=utf-8" },
        }
      );
    }

    // Check Basic Auth header.
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Basic ")) {
      try {
        const decoded = atob(authHeader.slice(6));
        const colonIdx = decoded.indexOf(":");
        const providedPassword =
          colonIdx >= 0 ? decoded.slice(colonIdx + 1) : decoded;
        if (timingSafeEqual(providedPassword, expectedPassword)) {
          return context.next();
        }
      } catch {
        // malformed base64 — fall through to 401 challenge
      }
    }

    // Challenge the browser.
    const realm = `Proposal — ${slug}`;
    return new Response("Authentication required.", {
      status: 401,
      headers: {
        "www-authenticate": `Basic realm="${realm}", charset="UTF-8"`,
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    // Never leak the crash page — return a clean 500 and log for the owner.
    console.error("[proposal-auth] unexpected error:", err && (err.stack || err.message || err));
    return new Response(
      "Authentication system error. Please contact MissionCTRL (hello@missionctrl.agency).",
      {
        status: 500,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }
    );
  }
};

/** Read an env var through whichever API the runtime exposes. */
function readEnv(name) {
  try {
    if (typeof Netlify !== "undefined" && Netlify.env && typeof Netlify.env.get === "function") {
      const v = Netlify.env.get(name);
      if (v) return v;
    }
  } catch {
    // ignore and try Deno
  }
  try {
    if (typeof Deno !== "undefined" && Deno.env && typeof Deno.env.get === "function") {
      return Deno.env.get(name);
    }
  } catch {
    // no env access available
  }
  return undefined;
}

/** Length-preserving, constant-ish time string compare. */
function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export const config = {
  // Scoped to the Solmax proposal only. Add more client paths to this array
  // (and set a matching PROPOSAL_PASSWORD_<SLUG> env var) to onboard future
  // clients with their own passwords.
  path: ["/proposals/solmax", "/proposals/solmax/", "/proposals/solmax/*"],
};
