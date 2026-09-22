# Horse Rescue Platform

A static Horse Rescue website. The existing application is in [`index`](./index); [`index.html`](./index.html) is the deployable homepage entry point used by static hosts such as GitHub Pages.

## Run locally

From the repository directory, start any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>.

## Publish with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select `main` and the `/ (root)` folder, then save.
4. Open the Pages URL shown by GitHub after deployment completes.

The horse profiles and contact submissions in the current app are demonstration/browser-local data. Connect a secure backend before using it for real rescue records or public submissions.
