# Vision board

App de suivi d'objectifs annuels, multi-utilisateurs. Chaque personne se
connecte par lien magique (email) et a son propre board, privé.

Trois types d'items :
- **Simple** — une case à cocher
- **Compteur** — progression chiffrée (ex: 8/8 sorties)
- **Liste** — sous-entrées nommées (ex: titres de livres lus)

## Mise en place Supabase (une fois)

1. Crée un projet gratuit sur [supabase.com](https://supabase.com)
2. Dans le dashboard : **SQL Editor** → colle le contenu de
   `supabase/migration.sql` → **Run**. Ça crée la table `goals` et les
   règles de sécurité (chacun ne voit que ses propres objectifs).
3. Dans **Project Settings > API**, récupère :
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Dans **Authentication > Providers**, l'authentification par email
   (magic link) est activée par défaut — rien à faire de plus. Dans
   **Authentication > URL Configuration**, ajoute l'URL de ton site
   déployé (et `http://localhost:5173` pour le développement local) dans
   les "Redirect URLs".

## Développement local

```bash
cp .env.example .env
# remplis .env avec tes clés Supabase
npm install
npm run dev
```

## Déploiement sur Netlify

1. Pousser ce dossier sur un repo Git (GitHub/GitLab)
2. Sur Netlify : "Add new site" → "Import an existing project"
3. Build command : `npm run build` / Publish directory : `dist`
   (déjà réglé dans `netlify.toml`)
4. Dans **Site settings > Environment variables**, ajoute
   `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
5. Retourne dans Supabase > Authentication > URL Configuration et ajoute
   l'URL Netlify (`https://ton-site.netlify.app`) aux Redirect URLs

## Partager avec plusieurs personnes

Une fois déployé, envoie simplement l'URL Netlify. Chaque personne qui
ouvre le lien crée son propre compte (email uniquement, pas de mot de
passe) et voit uniquement son propre vision board.
