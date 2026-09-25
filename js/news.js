/**
 * MoroccoTripMap – Morocco Tourism News widget
 * ---------------------------------------------
 * Loads /data/news.json (a static file regenerated automatically once a day
 * by the GitHub Action in .github/workflows/update-news.yml, which runs
 * scripts/fetch-news.py against Google News RSS for "Morocco tourism" and
 * "World Cup 2030" and commits the result back to the repo).
 *
 * Why a static JSON file instead of calling an RSS feed directly from the
 * browser?
 *   1. Browsers can't parse RSS/XML across origins without a CORS proxy,
 *      and free proxies are unreliable / rate-limited for production use.
 *   2. A file generated once a day is fast (no external request slows down
 *      the homepage) and works even if the news source is temporarily down.
 *   3. It's free and needs no server — GitHub Actions + GitHub Pages is enough.
 *
 * If you ever want near-real-time updates instead of daily, see the
 * "OPTION B" comment at the bottom of this file.
 */
(function () {
  const GRID_ID = "news-grid";
  const UPDATED_ID = "news-updated";
  const JSON_PATH = "data/news.json";
  const MAX_ITEMS = 6;

  function timeAgo(iso) {
    if (!iso) return "";
    const diffMs = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diffMs / 36e5);
    if (hours < 1) return "just now";
    if (hours < 24) return hours + "h ago";
    const days = Math.floor(hours / 24);
    return days + "d ago";
  }

  function cardHTML(item) {
    const img = item.image
      ? `<div class="h-36 overflow-hidden"><img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover" loading="lazy"></div>`
      : "";
    return `
      <a href="${item.link}" target="_blank" rel="noopener noreferrer"
         class="block bg-white rounded-2xl overflow-hidden border border-sable/10 shadow-sm hover:shadow-md transition group">
        ${img}
        <div class="p-5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-sable">${item.source || "Morocco News"}</span>
          <h3 class="text-sm font-semibold text-sombre mt-1 leading-snug group-hover:text-vert transition">${item.title}</h3>
          <span class="text-[11px] text-gray-400 mt-2 block">${timeAgo(item.published)}</span>
        </div>
      </a>`;
  }

  async function loadNews() {
    const grid = document.getElementById(GRID_ID);
    if (!grid) return;
    try {
      const res = await fetch(JSON_PATH, { cache: "no-store" });
      if (!res.ok) throw new Error("news.json not found");
      const data = await res.json();
      const items = (data.items || []).slice(0, MAX_ITEMS);

      if (!items.length) throw new Error("empty feed");

      grid.innerHTML = items.map(cardHTML).join("");

      const updatedEl = document.getElementById(UPDATED_ID);
      if (updatedEl && data.generated_at) {
        updatedEl.textContent = "Last updated: " + new Date(data.generated_at).toLocaleDateString();
      }
    } catch (err) {
      // Fail quietly with a friendly fallback instead of breaking the page.
      grid.innerHTML = `
        <div class="col-span-full text-center text-sm text-sombre/50 py-8">
          Latest Morocco travel news will appear here shortly.
        </div>`;
      console.warn("MoroccoTripMap news widget:", err.message);
    }
  }

  document.addEventListener("DOMContentLoaded", loadNews);

  /**
   * OPTION B — near-live updates instead of once a day
   * ----------------------------------------------------
   * If you'd rather fetch fresh headlines on every page load (at the cost of
   * depending on a third-party proxy and a slower first paint), replace the
   * fetch() call above with a direct call to a service like rss2json.com:
   *
   *   const feedUrl = encodeURIComponent(
   *     'https://news.google.com/rss/search?q=Morocco+tourism+OR+"World+Cup+2030"&hl=en-MA&gl=MA&ceid=MA:en'
   *   );
   *   const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${feedUrl}`);
   *   const data = await res.json(); // data.items[].title / .link / .pubDate
   *
   * rss2json's free tier is rate-limited, so this is fine for testing but
   * the GitHub Actions approach above is the more reliable choice for
   * production traffic.
   */
})();
