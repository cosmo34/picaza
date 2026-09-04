# Picaza — site studio

Site vitrine pour toutes les applications Picaza : catalogue, fiches produit, confidentialité, support et liens de téléchargement.

## URLs prévues

| Page | URL |
|------|-----|
| Accueil | https://picaza.fr/ |
| Apps | https://picaza.fr/#apps |
| Confidentialité | https://picaza.fr/privacy/ |
| Support | https://picaza.fr/support/ |
| Contact | contact@picaza.fr |

Exemples App Store :
- https://picaza.fr/privacy/goway/
- https://picaza.fr/support/goway/

## Prévisualisation locale

```bash
cd picaza-site
python3 -m http.server 4173
# ouvrir http://localhost:4173
```

## Déploiement GitHub Pages + domaine

1. Repo GitHub (ce projet) avec Pages source = branche `main` / dossier `/` (racine)
2. Fichier `CNAME` = `picaza.fr`
3. Chez ton registrar DNS (pour `picaza.fr`) :

**Option A — apex + www (recommandé GitHub)**

| Type | Nom | Valeur |
|------|-----|--------|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `cosmo34.github.io` |

4. Dans GitHub → Settings → Pages → Custom domain : `picaza.fr` → Enforce HTTPS

Propagation DNS : quelques minutes à 48 h.

## Apps listées

- GOWAY
- Cot Cot
- Master Cell
- Viewzy
- Oculus
- Jumpy (bientôt)

Quand une app est sur l’App Store, ajoute le lien dans `js/main.js` (`store`) et sur la fiche `apps/*.html`.
