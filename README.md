# What to Edit Next — Project Page

Static GitHub Pages website for:

> **What to Edit Next: Visually Aligned Image-Editing Follow-Up Suggestions in
> Conversational Systems**

The page is based on the supplied `rethinking-cfg-opd.github.io` project-page
template and has been adapted to this paper's visual identity, method, figures,
and experimental results.

## Structure

```text
index.html                       # Project page content
css/style.css                    # Template styles + paper-specific components
js/main.js                       # Tabs, lightbox, BibTeX, progress, navigation
assets/paper.pdf                 # Single-column technical report
assets/paper-two-column.pdf      # Two-column paper
assets/figures/teaser.png        # Product motivation figure
assets/figures/framework.png     # Three-stage framework
assets/figures/data-pipeline.png # SFT data construction
assets/figures/source-target.webp # Optimized verifier examples
.nojekyll                        # Disable Jekyll processing on GitHub Pages
```

## Preview locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Deploy to GitHub Pages

Push this directory as the root of a GitHub repository. In the repository,
select **Settings → Pages → Deploy from a branch → main / root**. The page will
be published at:

```text
https://<username>.github.io/<repository>/
```

All paper assets use relative paths and work under a repository subpath.

## Before the public launch

When the public arXiv and code URLs are available, add their buttons to the
resource navigation in `index.html` and update the BibTeX entry with the final
venue or arXiv identifier.
