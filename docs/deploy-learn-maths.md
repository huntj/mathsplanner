# Putting Learn Maths online

Learn Maths is published at **https://learnmaths.jedhunt.co.uk**. The code stays in this
repository (`huntj/mathsplanner`); the workflow `.github/workflows/learn.yml` builds `apps/learn`
and pushes the finished site to a second repository, `huntj/learnmaths`, whose GitHub Pages serves
it. A second repository is needed because GitHub Pages allows one custom domain per repository, and
this one already serves mathsplanner.jedhunt.co.uk.

The set-up below is done once. After that, every change merged into `main` that touches the app,
the packages or the course data is online a few minutes later.

## 1. Create the `learnmaths` repository

1. On GitHub, choose **New repository**.
2. Owner `huntj`, name `learnmaths`, **Public** (free GitHub Pages needs a public repository).
3. Leave it empty: no README, no .gitignore, no licence. Choose **Create repository**.

## 2. Let this repository push to it

The workflow pushes with an SSH _deploy key_, which can reach `learnmaths` and nothing else.

1. Make a key pair on your computer (Terminal on a Mac, PowerShell on Windows):

   ```sh
   ssh-keygen -t ed25519 -C "learnmaths deploy" -f learnmaths_deploy -N ""
   ```

   This makes two files: `learnmaths_deploy` (private) and `learnmaths_deploy.pub` (public).

2. In **`huntj/learnmaths`** → Settings → Deploy keys → **Add deploy key**:
   - Title: `mathsplanner workflow`
   - Key: the whole of `learnmaths_deploy.pub`
   - Tick **Allow write access**, then **Add key**.

3. In **`huntj/mathsplanner`** → Settings → Secrets and variables → Actions → **New repository
   secret**:
   - Name: `LEARN_DEPLOY_KEY`
   - Secret: the whole of `learnmaths_deploy`, including the `-----BEGIN` and `-----END` lines.

4. Delete both key files from your computer. GitHub has what it needs, and a new pair can be made
   at any time.

## 3. Merge into `main` and run the first deploy

The workflow runs from `main`, so merge the Learn Maths branch (through a pull request). The merge
starts the workflow; you can also start it from the **Actions** tab → **Deploy Learn Maths** →
**Run workflow**. When it goes green, `learnmaths` has a `gh-pages` branch holding the site.

If it fails at "Publish to huntj/learnmaths", the secret or the deploy key is usually the cause:
check the key was added with write access, and that the secret holds the private key, not the
`.pub` one.

## 4. Turn on GitHub Pages

In **`huntj/learnmaths`** → Settings → Pages:

1. Source: **Deploy from a branch**; branch **`gh-pages`**, folder **`/ (root)`**; Save.
2. Custom domain: `learnmaths.jedhunt.co.uk`; Save. (The workflow also writes a `CNAME` file, so
   this stays set after each deploy.)
3. Once GitHub says the DNS check has passed (after step 5) and the certificate is ready, tick
   **Enforce HTTPS**. This can take up to an hour.

## 5. Point the subdomain at GitHub (Fasthosts)

In the Fasthosts control panel: Domains → `jedhunt.co.uk` → DNS settings (sometimes "Advanced DNS"
or "Manage DNS") → add a record:

| Type  | Host / Name  | Points to / Value | TTL     |
| ----- | ------------ | ----------------- | ------- |
| CNAME | `learnmaths` | `huntj.github.io` | default |

Some panels want a full stop at the end (`huntj.github.io.`); either is fine. Nothing else needs
changing: `mathsplanner` and `www` keep working. The record usually works within an hour, but can
take up to a day.

To check it from a terminal: `nslookup learnmaths.jedhunt.co.uk` should mention `huntj.github.io`.

## 6. Verify the domain with GitHub (recommended)

Your GitHub profile picture → Settings → Pages → **Add a domain** → `jedhunt.co.uk`. GitHub shows
a `TXT` record (a host like `_github-pages-challenge-huntj` and a code); add it at Fasthosts the
same way as the CNAME, then choose **Verify**. This stops anyone else's repository taking a
jedhunt.co.uk subdomain. If you verified the domain for mathsplanner.jedhunt.co.uk already, skip
this.

## 7. Link to it from jedhunt.co.uk

Learn Maths is a whole app, so link to it rather than putting it inside another page. On the page
of your website where it should appear, add a link or button, for example:

```html
<a href="https://learnmaths.jedhunt.co.uk" class="button">Learn Maths: practise maths with Dot</a>
```

Or, as a short section:

```html
<section>
  <h2>Learn Maths (test version)</h2>
  <p>
    Bite-sized maths practice, a little every day. Years 7 and 8 are ready to try. Progress stays on
    your device and nothing about you is sent anywhere.
  </p>
  <p><a href="https://learnmaths.jedhunt.co.uk">Start practising</a></p>
</section>
```

If your site is built with a site builder rather than HTML, add a button or menu item whose link is
`https://learnmaths.jedhunt.co.uk`.

## 8. A feedback form for play-testers (optional)

The You page of the app has an "About this test version" card. It shows a **Tell us what you
think** button once there is a form to point at:

1. Make a form, for example a Google Form, with questions like: Which year are you in? What did you
   like? Was anything confusing or wrong? (Leave out names and email addresses: the pupils are
   children, and the app promises nothing about them is sent anywhere.)
2. Copy the form's link (Send → link icon).
3. In **`huntj/mathsplanner`** → Settings → Secrets and variables → Actions → **Variables** tab →
   **New repository variable**: name `LEARN_FEEDBACK_URL`, value the form's link (it must start
   with `https://`).
4. Run the workflow again (Actions → Deploy Learn Maths → Run workflow).

To change or remove the form later, edit or delete the variable and run the workflow again.

## Things play-testers should know

- Progress is kept in the browser on that device. A different device, a different browser, a
  private window or clearing browsing data starts afresh.
- Only Years 7 and 8 are ready; the other years show "Coming soon".
- "See an example" on the first screen shows what the path looks like halfway through Year 7.
