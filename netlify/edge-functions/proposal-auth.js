/**
 * Edge Function: Per-client Basic Auth for /proposals/<slug>/*
 *
 * Protects client-specific proposal pages. Each client's password is stored
 * in a Netlify environment variable named PROPOSAL_PASSWORD_<SLUG> where
 * <SLUG> is the uppercased directory name under /proposals/.
 *
 * Currently scoped to /proposals/solmax/* — add more paths to `config.path`
 * below as more clients come on board. Each new path needs its own env var.
 *
 * Example env vars (set in Netlify dashboard → Site settings → Environment):
 *   PROPOSAL_PASSWORD_SOLMAX = "theSecretPasswordYouChose"
 *   PROPOSAL_PASSWORD_ACME   = "aDifferentPasswordForAcme"
 *
 * Any username works — only the password is checked. Tell the client:
 * "Username can be anything, the password is <the one you set>."
 */

export default async (request, context) => {
  const url = new URL(request.url);

  // Extract the client slug: /proposals/{slug}/...
  const match = url.pathname.match(/^\/proposals\/([^\/]+)/);
  if (!match) return context.next();
  const slug = match[1];

  // Per-client env var: PROPOSAL_PASSWORD_<SLUG>
  const envKey = `PROPOSAL_PASSWORD_${slug.toUpperCase().replace(/-/g, "_")}`;
  const expectedPassword = Deno.env.get(envKey);

  // Fail closed: if no password is configured, block access entirely.
  if (!expectedPassword) {
    return new Response(
      `Access to this proposal has not been configured.\n\nPlease contact MissionCTRL (hello@missionctrl.agency).`,
      {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      }
    );
  }

  // Check the Authorization header the browser sends after the user types
  // their password into the native Basic Auth prompt.
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Basic ")) {
    try {
      const decoded = atob(authHeader.slice(6));
      const colonIdx = decoded.indexOf(":");
      const providedPassword = colonIdx >= 0 ? decoded.slice(colonIdx + 1) : decoded;

      // Constant-time-ish comparison. Basic Auth isn't cryptographically
      // privileged over HTTPS anyway, but avoid trivial early-exit timing.
      if (timingSafeEqual(providedPassword, expectedPassword)) {
        return context.next();
      }
    } catch {
      // Malformed base64 → fall through to 401
    }
  }

  // Challenge the browser for credentials
  const realm = `Proposal — ${slug}`;
  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "www-authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
};

/** Constant-time string comparison (returns false fast only on length mismatch) */
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
  // Matches /proposals/solmax, /proposals/solmax/, and everything beneath it.
  // To add a new client, append another path here and set a matching
  // PROPOSAL_PASSWORD_<SLUG> env var in the Netlify dashboard.
  path: ["/proposals/solmax", "/proposals/solmax/", "/proposals/solmax/*"],
};
