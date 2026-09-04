# Héberger Picaza sur OVH + sync Git

Objectif : **GitHub = source de vérité**, **OVH = hébergement public** (`https://picaza.fr`).

## État actuel

| Élément | Statut |
|---------|--------|
| Repo Git | https://github.com/cosmo34/picaza |
| Domaine OVH `picaza.fr` | OK |
| Hébergement web | **Actif** — Free hosting 100 Mo (`picazah.cluster121.hosting.ovh.net`) |
| IP | `188.165.53.185` / `2001:41d0:301::21` |
| DNS | A `@` → IP OVH, CNAME `www` → `picaza.fr.` (MX mail conservés) |
| Déploiement | Workflow `.github/workflows/deploy-ovh.yml` + secrets FTP |

## Secrets GitHub

Repo `cosmo34/picaza` → Settings → Secrets and variables → Actions :

| Secret | Valeur typique |
|--------|----------------|
| `OVH_FTP_HOST` | `ftp.cluster121.hosting.ovh.net` |
| `OVH_FTP_USER` | `picazah` |
| `OVH_FTP_PASSWORD` | *(mot de passe FTP)* |
| `OVH_FTP_SERVER_DIR` | `/www/` |

Credentials locaux (hors git) : `~/.config/picaza/ovh/ftp.env`

## Déploiement

Chaque `git push` sur `main` (ou `workflow_dispatch`) synchronise le site statique vers `/www/`.

## SSL

Manager OVH → Hébergements → `picaza.fr` → **Certificats SSL** → activer Let's Encrypt pour `picaza.fr` et `www.picaza.fr`.
