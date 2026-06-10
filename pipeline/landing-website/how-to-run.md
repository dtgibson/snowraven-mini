## Seeing the landing site locally

1. Open `website/index.html` in your browser (double-click it, or paste the `file://` path into the address bar).
2. Click the sun/moon button in the header to toggle dark mode. Resize the window narrow to see the mobile layout and the hamburger menu.
3. Check the links (GitHub, the release, Help) go where you expect. The store buttons are intentionally "coming soon" and do not link anywhere yet.

To preview exactly as it will be served, you can run a local static server:

```
cd website
python3 -m http.server 8000
```

then open `http://localhost:8000`.

### Deploy
Deployment is handled by `.github/workflows/pages.yml` on every push to `main` that touches `website/`. It needs two one-time manual steps, which we will walk through at the Deployer step:
- In the repo settings, set Pages -> Source to "GitHub Actions."
- Add a DNS CNAME record: host `snowravenmini`, value `dtgibson.github.io`.
