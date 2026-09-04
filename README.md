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

- **GOWAY** — mobilité Montpellier (fiche complète ; App Store à venir)
- **Viewzy** — iPad, lien App Store + captures
- **Oculus** — Mac, lien Mac App Store + captures

Les captures Viewzy / Oculus sont tirées de la fiche publique App Store (API iTunes).
Quand GOWAY sera publié, ajoute son Apple ID dans `js/store-meta.json` puis régénère la fiche.
