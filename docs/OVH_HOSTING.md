# Héberger Picaza sur OVH + sync Git

Objectif : **GitHub = source de vérité**, **OVH = hébergement public** (`https://picaza.fr`).

## État actuel

| Élément | Statut |
|---------|--------|
| Repo Git | https://github.com/cosmo34/picaza |
| Domaine OVH `picaza.fr` | OK |
| Hébergement web OVH | **Absent** (API : pas de `/hosting/web`) |
| DNS | Pointé vers GitHub Pages (temporaire) |

Sans offre **Hébergement web** OVH, on ne peut pas y publier de fichiers.

## Étape 1 — Commander un hébergement web OVH

1. [Hébergement web OVH](https://www.ovhcloud.com/fr/web-hosting/) — offre **Perso** suffit pour un site statique
2. Associer le domaine **picaza.fr** à l’hébergement
3. Dans l’espace client → Hébergements → ton service → **FTP - SSH** :
   - Serveur FTP (ex. `ftp.cluster0XX.hosting.ovh.net`)
   - Login / mot de passe FTP
   - Répertoire cible : souvent `/www/` ou `www/`

## Étape 2 — Secrets GitHub (sync auto)

Repo `cosmo34/picaza` → **Settings** → **Secrets and variables** → **Actions** → New repository secret :

| Secret | Exemple |
|--------|---------|
| `OVH_FTP_HOST` | `ftp.cluster023.hosting.ovh.net` |
| `OVH_FTP_USER` | `picazafr` |
| `OVH_FTP_PASSWORD` | *(mot de passe FTP)* |
| `OVH_FTP_SERVER_DIR` | `/www/` |

Le workflow `.github/workflows/deploy-ovh.yml` déploie à chaque `git push` sur `main`.

## Étape 3 — Remettre le DNS vers OVH

Quand l’hébergement est prêt, OVH affiche l’IP ou le cluster cible (souvent un **A** fourni dans « Multisite / DNS »).

Exemple typique (à remplacer par les valeurs OVH de ton hébergement) :

| Type | Sous-domaine | Cible |
|------|--------------|-------|
| A | `@` | *IP fournie par l’hébergement OVH* |
| CNAME | `www` | `picaza.fr.` |

Ou laisser OVH « Réinitialiser la zone DNS » / « Attacher le domaine » depuis le panneau Hébergement (plus simple).

Puis activer le **SSL Let's Encrypt** gratuit dans OVH → Multisite → picaza.fr → SSL.

## Étape 4 — Me donner

Quand c’est commandé, envoie :
1. Confirmation que l’hébergement existe
2. Les 4 secrets FTP (ou dis-moi de les lire si tu les mets dans `~/.config/picaza/ovh/ftp.env`)
3. (Optionnel) élargir la clé API OVH avec `GET/PUT/POST /hosting/web/*`

Je pourrai alors :
- basculer le DNS vers l’hébergement OVH
- lancer le premier déploiement
- vérifier `https://picaza.fr`
