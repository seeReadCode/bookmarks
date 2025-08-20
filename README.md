# Bookmarks 

via Raindrops, Next.js, GitHub Pages, and written in Code Spaces

Based on [nextjs-github-pages](https://github.com/gregrickaby/nextjs-github-pages)

## Links
- [repo](https://github.com/seeReadCode/bookmarks)
- [codespace dev](https://shiny-lamp-wpjpj5q7vj3ggw9.github.dev/)
- [codespace admin](https://github.com/codespaces?repository_id=1036822786)


## Docs


> ⚠️ Heads up! GitHub Pages _does not_ support serverless or edge functions. This means dynamic functionality will be disabled. See all the [unsupported features](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features).

---
## TODO
- deploy.yml (from cloned repo) v. alt from github.com
- fix build 

## Changelog

- Enabled Github Pages on github.com via suggested Next.js config 
- Replaced `next-js-github-pages`
- Set env variables via github.com and tested in Codespace console



### Enable GitHub Pages

1. Go to your repository's **Settings** tab
2. Click "Pages" in the sidebar
3. Under "Build and Deployment", select "GitHub Actions" as the source:

![screenshot of github pages settings](https://dl.dropboxusercontent.com/s/vf74zv2wcepnt9w/Screenshot%202025-02-03%20at%2021.10.06.png?dl=0)

### Push to GitHub

Now that everything is configured, you can commit your code and push to GitHub. This will trigger the GitHub Action workflow and deploy your app to GitHub Pages.

```bash
git add . && git commit -m "initial commit" && git push
```

You should see your site deployed to GitHub Pages in a few minutes. 🚀

---

## Wrap up

Thanks for reading and I hope this helps. If you noticed someting wrong, please [open an issue](https://github.com/gregrickaby/nextjs-github-pages/issues). Cheers! 🍻

---
