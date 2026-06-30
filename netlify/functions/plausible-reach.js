// Returns this month's visits for both sites from the Plausible Stats API,
// so the Brand Growth Dashboard's "Reach" band can pull them live.
//
// The Plausible API key NEVER goes in the browser — it lives only here, as a
// Netlify environment variable, and is read server-side.
//
// Required Netlify env var:
//   PLAUSIBLE_API_KEY        (Plausible → Settings → API Keys → create one)
// Optional env vars (defaults shown — must match the exact domain shown in each
// Plausible site's settings; change only if yours differ):
//   PLAUSIBLE_SITE_MC        default "missionctrl.agency"
//   PLAUSIBLE_SITE_TRUSTOS   default "trustos.missionctrl.agency"
//   PLAUSIBLE_HOST           default "https://plausible.io"   (only change if self-hosted)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=900', // 15 min — visits don't need to be realtime
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };

  const apiKey = process.env.PLAUSIBLE_API_KEY;
  if (!apiKey) return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: 'PLAUSIBLE_API_KEY not set' }) };

  const host = process.env.PLAUSIBLE_HOST || 'https://plausible.io';
  const siteMc = process.env.PLAUSIBLE_SITE_MC || 'missionctrl.agency';
  const siteTrustos = process.env.PLAUSIBLE_SITE_TRUSTOS || 'trustos.missionctrl.agency';

  async function visitsThisMonth(siteId) {
    const url = host + '/api/v1/stats/aggregate?site_id=' + encodeURIComponent(siteId) +
                '&period=month&metrics=visits,visitors,pageviews';
    const res = await fetch(url, { headers: { Authorization: 'Bearer ' + apiKey } });
    if (!res.ok) throw new Error(siteId + ' -> ' + res.status + ' ' + (await res.text()));
    const data = await res.json();
    const r = (data && data.results) || {};
    return {
      visits: (r.visits && r.visits.value) || 0,
      visitors: (r.visitors && r.visitors.value) || 0,
      pageviews: (r.pageviews && r.pageviews.value) || 0,
    };
  }

  try {
    const [mc, trustos] = await Promise.all([visitsThisMonth(siteMc), visitsThisMonth(siteTrustos)]);
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        period: 'month',
        mc: mc.visits,
        trustos: trustos.visits,
        detail: { missionctrl: mc, trustos: trustos },
        generatedAt: new Date().toISOString(),
      }),
    };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ error: String((e && e.message) || e) }) };
  }
};
