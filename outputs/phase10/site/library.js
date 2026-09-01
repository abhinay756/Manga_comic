const $ = (id) => document.getElementById(id);

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function localHref(href) {
  return href ? String(href).replace(/^\/media\//, "./media/") : "";
}

function editionCard(title, edition, emphasis = false) {
  const available = Boolean(edition?.available);
  const pdf = available ? localHref(edition.pdf_href) : "";
  return `
    <section class="public-edition ${emphasis ? "edition-featured" : ""}">
      <div class="edition-topline">${esc(edition?.phase || "unpublished")}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(edition?.label || "This edition is not published yet.")}</p>
      <div class="edition-actions">
        ${pdf ? `<a class="edition-button" href="${esc(pdf)}" target="_blank" rel="noopener">Read PDF <span>↗</span></a>` : ""}
        ${available && !pdf ? '<span class="edition-note">Files are being prepared.</span>' : ""}
        ${available && pdf ? '<span class="edition-note">Vertical preview arrives with the next export.</span>' : ""}
        ${!available ? '<span class="edition-note">Coming soon</span>' : ""}
      </div>
    </section>`;
}

function storyCard(story) {
  const editions = story.editions || {};
  const packet = `./episodes/${encodeURIComponent(story.id)}.json`;
  return `
    <article class="public-story-card">
      <div class="story-card-art" aria-hidden="true"><span>${String(story.id || "ME").slice(0, 2).toUpperCase()}</span></div>
      <div class="story-card-body">
        <div class="story-card-meta"><span>${esc(story.phase || "story")}</span><span>${Number(story.panel_count || 0)} panels</span></div>
        <h2>${esc(story.title || "Untitled story")}</h2>
        <p class="story-topic">${esc(story.topic || "A Manga Engine story.")}</p>
        <a class="packet-link" href="${packet}" target="_blank" rel="noopener">View episode data <span>→</span></a>
        <div class="public-edition-grid">
          ${editionCard("Reader edition", editions.reader, true)}
          ${editionCard("Image-only edition", editions.image_only)}
        </div>
      </div>
    </article>`;
}

async function loadLibrary() {
  const grid = $("libraryGrid");
  const error = $("libraryError");
  error.hidden = true;
  grid.setAttribute("aria-busy", "true");
  grid.innerHTML = '<div class="library-loading"><span></span> Loading stories…</div>';
  try {
    const response = await fetch(`./catalog.json?updated=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
    const catalog = await response.json();
    const stories = Array.isArray(catalog.stories) ? catalog.stories : [];
    $("librarySummary").textContent = `${stories.length} ${stories.length === 1 ? "story" : "stories"} · ${catalog.updated_at ? `updated ${new Date(catalog.updated_at).toLocaleDateString()}` : "local static edition"}`;
    grid.innerHTML = stories.length ? stories.map(storyCard).join("") : '<div class="library-empty"><strong>No published stories yet.</strong><span>Return after the next export.</span></div>';
  } catch (err) {
    $("librarySummary").textContent = "Library unavailable";
    grid.innerHTML = "";
    error.textContent = `Could not load the local catalog. ${err.message}`;
    error.hidden = false;
  } finally {
    grid.removeAttribute("aria-busy");
  }
}

$("refreshLib").addEventListener("click", loadLibrary);
loadLibrary();
