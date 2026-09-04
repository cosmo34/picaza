# Publier picaza.fr (OVH → GitHub Pages)

Le site est déjà sur GitHub Pages (`cosmo34/picaza`) avec `CNAME = picaza.fr`.  
Aujourd’hui le domaine pointe encore vers la page parking OVH (`213.186.33.5`).

## Enregistrements DNS à créer chez OVH

Espace client OVH → **Web Cloud** → **Noms de domaine** → **picaza.fr** → **Zone DNS**

### 1. Supprimer (si présents)
- L’enregistrement **A** de `picaza.fr` vers `213.186.33.5` (parking)
- Tout **CNAME** / redirection web OVH vers `www.picaza.fr` qui gêne

### 2. Ajouter pour l’apex `picaza.fr`

| Type | Sous-domaine | Cible | TTL |
|------|--------------|-------|-----|
| **A** | *(vide / @)* | `185.199.108.153` | 3600 |
| **A** | *(vide / @)* | `185.199.109.153` | 3600 |
| **A** | *(vide / @)* | `185.199.110.153` | 3600 |
| **A** | *(vide / @)* | `185.199.111.153` | 3600 |

### 3. Ajouter pour `www`

| Type | Sous-domaine | Cible | TTL |
|------|--------------|-------|-----|
| **CNAME** | `www` | `cosmo34.github.io.` | 3600 |

> Le point final après `cosmo34.github.io.` est recommandé dans les zones DNS classiques.

### 4. Ne pas toucher
- Enregistrements **MX** / e-mail (`contact@picaza.fr`)
- **TXT** SPF / DKIM si présents

## Après propagation (5 min – 48 h)

1. GitHub → repo `picaza` → **Settings** → **Pages**
2. Custom domain : `picaza.fr` (déjà configuré)
3. Cocher **Enforce HTTPS** dès que le certificat est prêt

Vérification :
```bash
dig +short picaza.fr A
# doit afficher les 4 IP 185.199.x.x

curl -I https://picaza.fr/
# HTTP/2 200
```

## API OVH (optionnel)

Si tu crées des credentials API OVH (Application Key / Secret / Consumer Key) avec droit `domain`, on pourra appliquer la zone automatiquement.
