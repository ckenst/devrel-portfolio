# Hosting the DevRel Portfolio at kenst.com/devrel-portfolio

## Goal

Serve this Starlight portfolio at:

```text
https://kenst.com/devrel-portfolio/
```

while keeping Ghost as the primary application for `kenst.com`.

## Architecture

Ghost continues to serve the main site:

```text
https://kenst.com/
```

The DevRel portfolio is built as a static Astro/Starlight site and hosted separately. A reverse proxy routes only the `/devrel-portfolio/` path to that static site.

```text
Visitor
  -> kenst.com
    -> Ghost for normal routes
    -> Static portfolio host for /devrel-portfolio/*
```

## Required Astro Configuration

Update `astro.config.mjs` for the final production URL:

```js
const site = process.env.SITE ?? 'https://kenst.com';
const base = process.env.BASE_PATH ?? '/devrel-portfolio';
```

The `base` value must stay `/devrel-portfolio` so Starlight emits asset URLs like:

```text
/devrel-portfolio/_astro/...
```

## Static Site Hosting Options

Pick one place to host the built `dist/` output.

### Option A: Small VPS or Existing Server

Build locally or in GitHub Actions:

```bash
npm ci
npm run build
```

Deploy `dist/` to a directory on the server, for example:

```text
/var/www/devrel-portfolio/
```

Then configure the web server in front of Ghost to serve that directory for `/devrel-portfolio/`.

### Option B: Cloudflare Pages

Create a Cloudflare Pages project from this repo:

```text
Build command: npm run build
Output directory: dist
```

Then proxy `https://kenst.com/devrel-portfolio/*` to the Cloudflare Pages deployment.

This is clean if DNS already runs through Cloudflare.

### Option C: Netlify or Vercel

Deploy this repo as a separate static project:

```text
Build command: npm run build
Output directory: dist
```

Then configure a rewrite/proxy from `kenst.com/devrel-portfolio/*` to the hosted static project.

## Reverse Proxy Examples

### Nginx Directory-Based Hosting

Use this if the static files live on the same server as the reverse proxy.

```nginx
server {
    server_name kenst.com www.kenst.com;

    location ^~ /devrel-portfolio/ {
        alias /var/www/devrel-portfolio/;
        try_files $uri $uri/ /devrel-portfolio/index.html;
    }

    location / {
        proxy_pass http://127.0.0.1:2368;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Important detail: with `alias`, the trailing slashes matter.

```text
location ^~ /devrel-portfolio/ { ... }
alias /var/www/devrel-portfolio/;
```

### Nginx Proxy to Separate Static Host

Use this if the portfolio is hosted elsewhere.

```nginx
server {
    server_name kenst.com www.kenst.com;

    location ^~ /devrel-portfolio/ {
        proxy_pass https://portfolio-static-host.example.com/devrel-portfolio/;
        proxy_set_header Host portfolio-static-host.example.com;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:2368;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## GitHub Actions Deployment Shape

If deploying to a server, replace the GitHub Pages workflow with a build-and-sync workflow:

1. Checkout repo.
2. Install Node.
3. Run `npm ci`.
4. Run `npm run build`.
5. Copy `dist/` to the static host.
6. Reload the reverse proxy if needed.

The copy step depends on the hosting target:

- `rsync` over SSH for a VPS.
- Cloudflare Pages deploy action for Cloudflare Pages.
- Netlify/Vercel deploy action for those platforms.

## Verification Checklist

After deployment, verify:

- `https://kenst.com/devrel-portfolio/` loads.
- `https://kenst.com/devrel-portfolio/technical-writing/` loads.
- The "Read the portfolio" button stays under `/devrel-portfolio/`.
- CSS and JS load from `/devrel-portfolio/_astro/`.
- Search assets load from `/devrel-portfolio/pagefind/`.
- Ghost routes like `https://kenst.com/` and normal blog posts still work.
- Canonical URLs use `https://kenst.com/devrel-portfolio/...`.
- `https://kenst.com/devrel-portfolio/sitemap-index.xml` exists.

## Recommended Path

If `kenst.com` is already behind Nginx, the simplest durable setup is:

1. Build this repo in GitHub Actions.
2. `rsync dist/` to `/var/www/devrel-portfolio/`.
3. Add an Nginx `location ^~ /devrel-portfolio/` block using `alias`.
4. Keep Ghost untouched for every other route.

If DNS already runs through Cloudflare and server access is limited, use Cloudflare Pages for the static build and a Cloudflare Worker or rule to route `/devrel-portfolio/*`.
