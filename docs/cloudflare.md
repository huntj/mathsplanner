# Cloudflare for jedhunt.co.uk

Cloudflare sits in front of the main website, jedhunt.co.uk, to filter out attacks and bad bots
before they reach the Fasthosts server. It also answers the domain's DNS: the "address book" that
says where each part of the domain lives. Cloudflare's free plan is enough.

## Where everything lives

| Name                                | Hosted at                         | Cloudflare proxy (orange cloud)    |
| ----------------------------------- | --------------------------------- | ---------------------------------- |
| jedhunt.co.uk and www.jedhunt.co.uk | Fasthosts web hosting             | **On**: this is what is protected  |
| mathsplanner.jedhunt.co.uk          | GitHub Pages (this repository)    | **Off** (DNS only)                 |
| learnmaths.jedhunt.co.uk            | GitHub Pages (`huntj/learnmaths`) | **Off** (DNS only)                 |
| Email (`@jedhunt.co.uk`)            | Fasthosts mail (livemail.co.uk)   | Off: email can never go through it |
| ftp.jedhunt.co.uk                   | Fasthosts                         | **Off** (DNS only)                 |

The GitHub Pages subdomains stay DNS only. GitHub already runs them behind its own large network,
and with the proxy on, GitHub cannot renew their HTTPS certificates (the renewal check reaches
Cloudflare instead of GitHub), so the sites break when the certificate runs out.

## DNS records

These are the records Fasthosts held when the domain moved to Cloudflare (checked November 2026).
Cloudflare's import should find them all; any that are missing must be added by hand, or email
or the apps stop working.

| Type  | Name                            | Content                                        | Proxy status |
| ----- | ------------------------------- | ---------------------------------------------- | ------------ |
| A     | `jedhunt.co.uk` (`@`)           | `77.68.64.8`                                   | Proxied      |
| A     | `www`                           | `77.68.64.8`                                   | Proxied      |
| CNAME | `mathsplanner`                  | `huntj.github.io`                              | DNS only     |
| CNAME | `learnmaths`                    | `huntj.github.io`                              | DNS only     |
| A     | `ftp`                           | `213.171.193.5`                                | DNS only     |
| MX    | `jedhunt.co.uk` (`@`)           | `mailserver.livemail.co.uk`, priority `10`     | (not shown)  |
| TXT   | `jedhunt.co.uk` (`@`)           | `v=spf1 mx a include:_spf.livemail.co.uk ~all` | (not shown)  |
| TXT   | `_dmarc`                        | `v=DMARC1; p=none;`                            | (not shown)  |
| TXT   | `_github-pages-challenge-huntj` | `72930683f10487a553104ef7b019fc`               | (not shown)  |

A new subdomain for GitHub Pages is now added in Cloudflare (DNS → Records → Add record), not at
Fasthosts, and must be set to **DNS only**.

## Settings

- **SSL/TLS → Overview: Full.** Traffic is encrypted all the way to Fasthosts. Not "Flexible"
  (unencrypted to Fasthosts, and it causes redirect loops), and not "Full (strict)" unless the
  Fasthosts certificate is known to renew without trouble.
- **SSL/TLS → Edge Certificates → Always Use HTTPS: On.** Sends `http://` visitors to `https://`.
- **Security → Bots → Bot Fight Mode: On.** Challenges known bad bots.
- **Under Attack Mode: Off.** Turn it on only during an attack: it shows every visitor a short
  check page first.
- **DNSSEC: optional.** It can be turned on later in DNS → Settings; Cloudflare then gives a DS
  record to add at Fasthosts.

The Fasthosts SSL certificate for jedhunt.co.uk (Sectigo) expires on 4 December 2026. "Full"
keeps the site working even if its renewal is late; "Full (strict)" would show visitors an error.
