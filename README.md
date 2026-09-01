# Manga Engine

> An end-to-end, cost-aware AI manga pipeline with a live dashboard, public reader, evaluation ledger, and repeatable visual-generation experiments.

Manga Engine turns a story brief into a structured comic episode, generates and assembles panels, tracks every model call and dollar spent, and publishes a reader-ready web experience. It is built as an experimentation platform, not a one-off image generator.

## Recruiter quick read

| In one minute | What to know |
| --- | --- |
| **What I built** | A Python/FastAPI comic-production system plus a polished static reader site. |
| **Core engineering** | Structured episode schemas, provider routing, API-cost telemetry, assembly, curation, feedback, and evaluation scorecards. |
| **Proof it works** | 44/44 panels rendered and composed across three completed stories; PDFs and Webtoon assets assembled. |
| **Cost discipline** | Historical R&D: **$2.96** across **129** tracked calls; blended estimate **$0.99/story** and **$0.067/panel**. |
| **Current product** | Admin dashboard, reader experience, exported public library, and Version 2A/2B experimental tracks. |

## Live local demo

Start the services, then open these links:

| Experience | Local URL | What it demonstrates |
| --- | --- | --- |
| Manga Engine dashboard | http://127.0.0.1:8765/ | Tasks, usage, stories, analytics, ROI, and evaluation controls. |
| Built-in reader | http://127.0.0.1:8765/review | Auth-ready reader and review flow. |
| Exported public library | http://127.0.0.1:8766/library.html | Clean, JavaScript-powered static publishing experience. |

## Demo recordings

No screen-recording files were included in this project copy, so this README deliberately does not contain broken video links. Add recordings here when available:

1. **Dashboard walkthrough** — usage ledger, task board, ROI, and story library.
2. **Reader walkthrough** — open a story, read the assembled PDF, and submit feedback.
3. **Public-site walkthrough** — static library loading `catalog.json` through JavaScript.
4. **Experiment walkthrough** — model bake-off results and the Version 2B scorecard.

Recommended placement after recording: upload to GitHub Releases, YouTube, or Loom and replace each item with a stable link. Do not commit API keys, `.env`, or private recordings.

## What the system does

```text
Story brief + character notes
        ↓
Structured Episode JSON (panels, dialogue, continuity, facts)
        ↓
Style lock + character references + image-provider routing
        ↓
Batch panel rendering and visual QA
        ↓
Local composition → Webtoon/PDF assembly → story catalog
        ↓
Dashboard, reader feedback, curation, ROI, and publish export
```

## Technical highlights

- **FastAPI dashboard** with live usage, task tracking, stories, image gallery, ROI, reader CRM, and review routes.
- **Auditable API usage ledger** in SQLite: provider, model, tokens, latency, purpose, phase, estimated cost, and error status.
- **Structured generation** using Pydantic episode data instead of loose prompts.
- **Visual pipeline** covering style selection, character-reference conditioning, panel rendering, composition, PDF/Webtoon assembly, and curation.
- **Static public site** that loads its local `catalog.json` with JavaScript and works without dashboard-only API routes.
- **Versioned experimentation** for storyboard-first and 3D-previs pipelines, with immutable scorecards and clear gates.

## Evidence and outcomes

### Version 1 — end-to-end production pipeline

- Three completed stories assembled successfully.
- **44/44** generated panels passed the batch/compose run with no reported errors.
- Model bake-off selected **`gemini_ref`** as the default character-locking method; `flux_kontext` remains a targeted retry path for hard identity cases.
- Historical economics: **$2.9598708** R&D spend, **129** calls, **$0.9866/story**, and **$0.0673/panel**.

### Version 2A — storyboard-first design

Version 2A moves composition control to the creator: a human storyboard is the camera contract, and the model enhances inside locked character, location, and lighting constraints. Architecture and Story Architect work are complete; visual bake-off, panel memory, and distillation gates remain intentionally locked until real storyboard inputs exist.

### Version 2B — 3D previs design

Version 2B makes a versioned 3D panel specification the camera contract:

```text
Panel spec → headless Blender AOVs → ControlNet/LoRA stylization
           → structure + identity + location + lighting scorecard
           → best-of-N selection + human preference labels
```

Proof-shot gates have passed: structure SSIM means ranged from **0.5488–0.5917** against a calibrated **0.53** floor. The evaluation report also calls out the remaining work honestly: production sequencing, broader best-of-N evaluation, more blinded human labels, and remediation for one under-floor G2 camera.

Read the full system and evaluation audit in [doc.txt](doc.txt).

## Run it locally

### 1. Configure Python and secrets

Python 3.10+ is required.

```bash
cd COMIC
python -m venv .venv
```

Activate the environment:

```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

Install dependencies and configure keys:

```bash
pip install -r requirements.txt
copy .env.example .env          # Windows
# cp .env.example .env          # macOS/Linux
```

Fill `.env` with your own provider credentials. Keep it local; it is ignored by Git.

### 2. Start the dashboard and built-in reader

```bash
python scripts/run_dashboard.py
```

Open http://127.0.0.1:8765/.

### 3. Start the exported public site

In a second terminal:

```bash
cd outputs/phase10/site
python -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766/library.html.

## Useful commands

```bash
# Confirm configured provider connectivity with low-cost text checks.
python scripts/ping_apis.py

# View and update the shared task board.
python scripts/tasks.py list
python scripts/tasks.py start phase3 --note "beginning bake-off"
python scripts/tasks.py done phase3

# Generate a first image or a style grid (uses configured providers).
python scripts/phase1_generate.py
python scripts/phase2_style_grid.py

# Generate the technical PDF report when LaTeX is installed.
python scripts/build_report.py
```

## Repository map

```text
src/comicengine/       Core pipeline: config, clients, schemas, usage, curation, ROI
dashboard/             FastAPI dashboard and authenticated reader
outputs/               Generated artifacts, manifests, assembled PDFs, public export
data/                  SQLite usage ledger plus Version 2A/2B program and eval data
scripts/               Repeatable phase commands and report/export tools
docs/                  Architecture contracts and deployment guidance
doc.txt                Full replication, experiment, architecture, and evaluation report
```

## Reproducibility and boundaries

- Keep seeds, provider/model names, prompts, reference assets, scorecards, and manifests with every experiment.
- Send text traffic through OmniRoute only when it is available; keep image-generation calls on direct provider APIs.
- The current public export includes one approved story and its PDFs. Re-export after publishing more stories.
- The remaining Version 2 visual gates need Blender and ComfyUI/model assets; do not claim full-sequence performance until those experiments are run.

## Project owner

**Abhinay** · Manga Engine
