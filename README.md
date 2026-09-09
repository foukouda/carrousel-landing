# Carrousel — landing page pré-Kickstarter

Landing page de collecte d'emails pour le Carrousel, par Serein Design.
Next.js 16 (App Router) · Tailwind v4 · Motion · Postgres (Supabase).

## Direction artistique

Le langage visuel s'inspire de **nothing.tech** : typo dot-matrix en display,
produit géant sur fond plat, étiquettes techniques en majuscules espacées,
grille stricte tracée à la hairline, beaucoup de vide.

La **palette reste celle du SUBSTOR Design System v1**, inchangée : fond cream
`#f6f1e6`, accent terracotta unique `#ac5634`, sage réservé au sémantique
« validé ». Les tokens sont dans [globals.css](src/app/globals.css) — c'est le
seul endroit où les changer.

Trois écarts assumés par rapport à la charte, tous documentés dans le CSS :

1. **Fraunces est retiré.** Un serif éditorial se bat avec le registre
   industriel de cette page. Le display est désormais composé dans la police
   bitmap 5×7 du panneau lui-même ([dot-font.ts](src/lib/dot-font.ts)), rendue
   en SVG par [DotMatrixText](src/components/dot-matrix-text.tsx). Inter reste
   sur tout le fonctionnel, comme la charte le prévoit.
2. **Rayons en deux valeurs.** Ce qui se touche est une pilule, ce qui se
   regarde est à angle vif. La charte impose les boutons ronds, elle est
   respectée ; ses cartes à 16px ne le sont pas, une carte molle affaiblissant
   la grille dessinée.
3. **Un chapitre sombre**, une seule fois sur la page, pour la section des
   applications. Un écran LED ne se lit que sur un fond sombre. Les tokens
   `ink` restent dans la famille chaude de la charte, et l'accent y devient
   `accent-soft` : le terracotta sur fond sombre mesure 3.1:1 et échouerait
   l'AA, `accent-soft` passe à 14:1.

**Le tricolore** apparaît partout où la page revendique une fabrication
française. La charte interdit un troisième accent et interdit le bleu ; ce
n'est pas un accent mais un emblème, cantonné à cette revendication, qui ne
colore jamais du texte, une bordure ou un état interactif. Il vit dans
[french-mark.tsx](src/components/french-mark.tsx).

---

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Le site s'affiche immédiatement. Le formulaire, lui, a besoin d'une base :
suis la section 1 ci-dessous, c'est cinq minutes. Sans elle il renvoie une
erreur explicite plutôt que de faire semblant d'enregistrer.

---

## 1. Brancher la base de données (Supabase)

Les inscriptions vont dans **Postgres**, une ligne par personne, avec l'adresse
en contrainte d'unicité. Il n'y a **pas de repli sur fichier** : une version
précédente écrivait dans un JSONL quand la base manquait, ce qui était pratique
et faux. Un déploiement mal configuré avait l'air de marcher tout en jetant
chaque inscription dans un système de fichiers éphémère. Maintenant, base
absente = échec visible, en local comme en production.

### Créer le projet

1. Sur [supabase.com](https://supabase.com), crée un projet.
2. **Choisis une région européenne** : `eu-west-3` (Paris) ou `eu-central-1`
   (Francfort).

   > La région ne se change pas après coup. C'est la décision RGPD la plus
   > importante ici, et la seule irréversible.

3. Bouton **Connect** en haut de la page, onglet **Transaction pooler**.

   Supabase propose trois chaînes, et une seule convient ici :

   | Onglet | Port | Verdict |
   | --- | --- | --- |
   | Direct connection | 5432 | **Non.** Une connexion par requête ; sur Vercel la limite Postgres saute dès que le trafic monte. |
   | **Transaction pooler** | **6543** | **Oui.** Conçu pour le serverless. |
   | Session pooler | 5432 | Fonctionne, mais garde une connexion ouverte par session. Inutilement coûteux. |

   La chaîne ressemble à :

   ```
   postgresql://postgres.abcdefgh:MOTDEPASSE@aws-0-eu-west-3.pooler.supabase.com:6543/postgres
   ```

   Remplace `[YOUR-PASSWORD]` par le mot de passe choisi à la création du
   projet. Oublié ? **Settings → Database → Reset database password**.

   > Le code est déjà configuré pour ce mode : `prepare: false` dans
   > [db.ts](src/lib/db.ts). Le pooler en mode transaction ne supporte pas les
   > requêtes préparées nommées, et sans ce réglage les erreurs n'apparaissent
   > que sous charge, une fois les connexions réutilisées.

4. Copie `.env.example` vers `.env.local`, colle l'URL dans `DATABASE_URL`,
   puis génère le secret de désinscription (la commande est dans le fichier).

5. Crée la table :

   ```bash
   npm run db:migrate
   ```

   Le script est idempotent : tu peux le relancer autant que tu veux, il ne
   détruit rien.

6. `npm run dev`, et le formulaire enregistre pour de vrai.

### Sur Vercel

Ajoute `DATABASE_URL` et `UNSUBSCRIBE_SECRET` dans **Settings → Environment
Variables**, pour Production *et* Preview. Sans elles, le formulaire renvoie une
503 au lieu de perdre des adresses en silence.

### Structure

Une table `waitlist`, une ligne par personne :

| Colonne           | Contenu                                        |
| ----------------- | ---------------------------------------------- |
| `email`           | l'adresse en minuscules, **unique**            |
| `source`          | `hero` ou `closing`, selon le formulaire        |
| `consent_text`    | le libellé exact accepté, comme preuve          |
| `consent_version` | la version de ce libellé                        |
| `consent_at`      | date du consentement                            |
| `created_at`      | première inscription                            |
| `updated_at`      | dernière soumission                             |

Rien d'autre : ni IP, ni referrer, ni langue du navigateur.

Une réinscription met à jour `source` et `updated_at`, et **laisse le
consentement d'origine intact**. C'est volontaire : ces colonnes sont la preuve
de ce que la personne a accepté, à la date où elle l'a accepté. Les écraser avec
le libellé du jour détruirait la preuve qu'exige l'article 7.1.

Le SQL est dans [waitlist-sql.ts](src/lib/waitlist-sql.ts), en un seul endroit.

### Exporter la liste

```bash
npm run db:export              # -> waitlist.csv
npm run db:export -- liste.csv
```

Le CSV contient des données personnelles. Il est déjà dans `.gitignore` et dans
`.dockerignore` ; supprime-le une fois l'email de lancement parti.

### Tester le SQL

```bash
npm run test:sql
```

Tourne contre un vrai Postgres compilé en WebAssembly, sans serveur ni Docker.
Vérifie le schéma, l'absence de doublon, la préservation du consentement à la
réinscription, la contrainte d'unicité et la suppression réelle.

### Protections en place

- Champ piège invisible : un bot qui le remplit reçoit un faux succès.
- 5 tentatives par minute et par IP, l'IP n'étant jamais écrite.
- Validation du format et de la longueur de l'adresse.
- Consentement vérifié côté serveur, pas seulement dans le formulaire.
- La connection string ne quitte jamais le serveur.

---

## 1 bis. Docker

```bash
docker compose up --build
docker compose exec web npm run db:migrate
```

→ http://localhost:3000, avec un Postgres 17 local. Même moteur que Supabase,
donc ce qui marche ici marche là-bas.

> **Vercel ignore le Dockerfile.** Si tu déploies sur Vercel, il construit à sa
> façon et ces fichiers ne servent pas en production. Ils servent au
> développement local avec une vraie base, et à garder l'auto-hébergement
> possible sans rien réécrire.

Le [Dockerfile](Dockerfile) est en plusieurs étapes : dépendances, build, puis
une image finale qui ne contient que le serveur compilé. Pas de sources, pas de
dépendances de développement, pas de chaîne de compilation. Il tourne sous un
utilisateur non-root et expose `/api/health` pour le healthcheck.

Le Postgres du compose est **jetable**, réservé au développement. Les vraies
données restent chez Supabase ; cette stack n'y touche jamais.

Deux choses que je n'ai pas pu vérifier : Docker n'est pas installé sur ta
machine, donc ces fichiers sont écrits mais **jamais exécutés**. En revanche
j'ai testé ce qu'ils exécutent : le serveur `standalone` compilé, lancé contre
un vrai Postgres, répond correctement sur `/api/health`, l'inscription, la
réinscription et la désinscription.

---

## 2. RGPD : ce qui est fait, ce qui reste à faire

### Fait

**Consentement.** Case à cocher non pré-cochée, obligatoire, avec le libellé en
clair à côté du champ. Vérifiée aussi côté serveur, parce qu'un formulaire se
contourne. Sans elle, l'adresse n'est pas enregistrée : le consentement est la
base légale (art. 6.1.a), il n'y a pas de repli.

**Preuve du consentement.** L'art. 7.1 met la charge de la preuve sur toi, et
prouver un consentement c'est prouver *à quoi* la personne a consenti. Chaque
inscription stocke donc le libellé exact et sa version, pas juste un booléen.
Le libellé vit dans `consent` dans [content.ts](src/lib/content.ts).

> Si tu modifies `consent.text`, **incrémente `consent.version`**. Sinon les
> anciens enregistrements prétendront un libellé que personne n'a lu.

**Minimisation (art. 5.1.c).** Stocké : l'adresse, le formulaire d'origine, la
date, le consentement. C'est tout. J'ai retiré le referrer et la langue du
navigateur que j'avais mis au départ : ils ne servent pas à envoyer un email au
lancement. L'IP n'est jamais écrite — elle reste en mémoire moins d'une minute
pour le compteur anti-spam.

**Droit de retrait (art. 7.3 et 17).** `/unsubscribe` supprime réellement
l'enregistrement, sans drapeau « inactif ». Le lien est signé par HMAC : sans
signature, n'importe qui pourrait vider ta liste en devinant des adresses. La
suppression est un POST derrière un bouton, jamais au chargement de la page,
parce que les clients mail et les scanners de sécurité ouvrent les liens tout
seuls et désinscriraient des gens qui n'ont rien cliqué.

Mets le lien dans chaque email que tu envoies :

```
https://ton-domaine/unsubscribe?email=<adresse>&token=<token>
```

Le token se calcule avec `makeUnsubscribeToken()` de
[unsubscribe-token.ts](src/lib/unsubscribe-token.ts).

**Pas de bandeau cookies, parce qu'il n'y a pas de cookies.** Aucun analytics,
aucun script tiers, aucun tracker. Les polices sont auto-hébergées par
`next/font`, donc le navigateur ne contacte jamais Google. C'est un vrai
avantage : la conformité la plus simple est celle qu'on n'a pas à gérer. Si tu
ajoutes un jour Google Analytics, Meta Pixel ou un chat, il te faudra un vrai
bandeau de consentement conforme CNIL, et cette page redeviendra complexe.

**Pages légales.** `/privacy` couvre les mentions de l'art. 13. `/legal` couvre
les mentions légales obligatoires (LCEN art. 6-III). Toutes deux liées depuis
le pied de page de chaque page.

### À faire avant la mise en ligne

**Remplis les `{{TODO}}` de [legal.ts](src/lib/legal.ts).** Ils s'affichent
surlignés en terracotta sur les pages — impossible de les rater. Il en reste
14 : raison sociale, forme juridique, adresse du siège, SIREN/RCS, TVA,
directeur de publication, hébergeur, adresse de contact RGPD, et le prestataire
d'envoi d'emails que tu choisiras. Je ne les ai pas inventés : un numéro RCS
plausible mais faux sur une page légale est pire qu'un trou visible.

**Choisis la région Supabase en Europe.** Voir la section 1. Irréversible.

**Génère `UNSUBSCRIBE_SECRET`** (voir `.env.example`). Sans lui, les liens
signés sont désactivés et la désinscription passe par un email manuel, ce qui
reste conforme mais te fait travailler à la main.

**Registre des traitements (art. 30).** Obligatoire même pour une petite
structure. Une page suffit pour ce traitement unique : finalité, base légale,
catégories de personnes et de données, destinataires, durée de conservation,
mesures de sécurité. Le contenu de `/privacy` te donne la matière.

**Une version française des pages légales.** Le site est en anglais pour
Kickstarter, et j'ai écrit les pages légales en anglais par cohérence. Mais tu
vises aussi des consommateurs français, et la loi Toubon impose le français
pour l'information commerciale en France. Une traduction est recommandée.

### Ce que je ne suis pas

Je ne suis pas juriste, et ceci n'est pas un avis juridique. La structure suit
le texte du RGPD et les recommandations CNIL sur la prospection, mais fais
relire les pages légales avant d'ouvrir la campagne.

## 3. Remplacer les emplacements photo

Deux photos manquent. En attendant, la page affiche un cadre qui décrit la prise
de vue attendue, plutôt qu'une image d'illustration sans rapport.

1. Dépose les fichiers dans `public/media/`.
2. Renseigne le chemin dans `media` au début de
   [content.ts](src/lib/content.ts) :

```ts
export const media = {
  object: { src: "/media/carrousel-walnut.jpg", ... },
  founder: { src: "/media/dimitry.jpg", ... },
};
```

| Emplacement    | Prise de vue attendue                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- |
| `object`       | Le Carrousel de trois quarts sur un bureau, écran relevé, grain du noyer et bras aluminium lisibles. Format très panoramique (21:9), 2400px de large minimum. |
| `founder`      | Dimitry à l'établi ou près de la machine. Portrait, 1200px de large minimum.                |

### Le fond du rendu compte

Le rendu que tu m'as montré est sur un fond gris studio dégradé. C'est
précisément ce qui empêche l'effet recherché : chez Nothing, le produit
**flotte sans couture** sur la couleur de la page, sans rectangle visible
autour de lui.

Refais le rendu avec un fond uni `#f6f1e6`, exactement le cream de la page, ou
mieux, exporte en **PNG avec fond transparent**. Le produit se posera alors
directement sur le papier, et l'image passera aussi sur le fond sombre si tu
la réutilises ailleurs. C'est le changement qui rapportera le plus sur cette
page.

Cadre-le large et en paysage : la photo occupe toute la largeur de l'écran,
donc un cadrage serré la rendra floue une fois étirée.

### Aligner l'écran vivant

Sur ton rendu CAO le panneau est éteint, ce qui dessert le produit : tout
l'argument du Carrousel, c'est ce que l'écran affiche. La page superpose donc
le panneau LED simulé sur la zone d'écran de la photo. Ce n'est pas une
maquette d'affichage, c'est l'affichage : même horloge, même Game of Life que
partout ailleurs sur la page.

Le calage se règle avec `media.object.screen` dans
[content.ts](src/lib/content.ts) : **les quatre coins** de la zone LED active,
en pourcentages de l'image, dans le sens horaire depuis le haut-gauche.

```ts
screen: {
  topLeft:     { x: 23.5, y: 12.5 },
  topRight:    { x: 73.8, y: 13.2 },
  bottomRight: { x: 73.8, y: 57.7 },
  bottomLeft:  { x: 23.6, y: 53.8 },
},
```

Des coins et pas un rectangle, parce que le rendu est vu de trois quarts :
l'écran est un trapèze, et aucun rectangle ne s'y pose, à aucune position ni
aucune taille. La page résout donc l'homographie qui envoie le panneau sur ces
quatre points — la même transformation projective que celle qu'a faite la
caméra. C'est écrit dans [homography.ts](src/lib/homography.ts) et vérifié :
les quatre coins retombent à 1e-15 près.

L'avantage, c'est que ça marche sous **n'importe quel angle** : ce rendu, un
prochain, ou une vraie photo sur un bureau. Tu n'auras jamais à réexporter en
vue de face pour que l'écran s'allume.

Les valeurs actuelles sont **estimées à l'œil** et demandent une passe sur un
vrai écran. Déplace un coin à la fois, le rechargement à chaud fait le reste.
Mets `screen: null` pour afficher la photo telle quelle.

L'écart vertical est volontaire : la dalle blanche fait environ du 16:9 alors
que la matrice 68x32 fait du 2.125:1, donc la zone allumée est en retrait
au-dessus et en dessous. **Si la dalle blanche est en fait toute la zone
allumée, supprime ce retrait** — sinon les pixels seront légèrement étirés.

### Poids de l'image

Ton PNG d'origine faisait 27 Mo en 3840x2160. Je l'ai réduit à 2560px de large
pour 0,96 Mo, sans différence visible : la bande fait au maximum 1360px de
large à l'écran. `next/image` sert ensuite des variantes WebP/AVIF encore plus
légères et adaptées à chaque appareil. L'original reste intact dans
`SITE ATUNAS/1.png`.

---

## 4. Modifier les textes

Tout le contenu visible est dans [content.ts](src/lib/content.ts). Aucune chaîne
n'est écrite en dur dans un composant.

`links` contient les URL externes. **Une valeur vide masque le lien** au lieu
d'afficher un lien mort : renseigne le Discord, le dépôt et le Kickstarter dès
qu'ils existent.

---

## 5. Ajouter le paiement de 1 € plus tard

La page collecte les emails aujourd'hui. Pour passer à l'engagement à 1 € :

1. Crée un **Payment Link** à 1 € dans le dashboard Stripe, en activant la
   collecte de l'email.
2. Dans [waitlist-form.tsx](src/components/waitlist-form.tsx), après le
   `setStatus("done")`, redirige vers ce lien :

```ts
setStatus("done");
window.location.href = process.env.NEXT_PUBLIC_STRIPE_LINK!;
```

L'email est déjà enregistré en base avant la redirection, donc tu gardes
le contact même si la personne abandonne le paiement.

---

## 6. Déployer

Le plus direct est Vercel :

```bash
npx vercel
```

Reporte les trois variables `FIREBASE_*` dans **Project Settings > Environment
Variables**. Attention à la clé privée : colle-la avec ses `\n` échappés,
exactement comme dans `.env.local`.

---

## Reste à trancher

Ces points sont marqués `TODO` dans le code plutôt que remplis au jugé.

- [ ] **L'année de la timeline.** Le brief dit « early March » sans année. La
      page affiche les mois seuls, à confirmer avant publication.
- [ ] **Le domaine de production**, dans `site.url` — il sert aux balises Open
      Graph, une valeur fausse casse l'aperçu au partage.
- [ ] **Les URL Discord, dépôt et Kickstarter**, dans `links`.
- [ ] **L'adresse de contact publique**, dans `links.contact`.
- [ ] **Les deux photos** ci-dessus.
- [ ] **Une mention RGPD.** Tu collectes des adresses email de résidents
      européens : il te faut une politique de confidentialité liée depuis le
      pied de page, et une phrase sur la finalité et la durée de conservation.
      Ce n'est pas encore sur la page.
- [ ] **Une image Open Graph** (`src/app/opengraph-image.png`, 1200x630), sinon
      le partage sur les réseaux affiche un rectangle vide.

---

## Ce qui n'est volontairement pas sur cette page

Le brief contenait le contenu complet de la campagne Kickstarter. Une landing
page de pré-lancement a un seul travail : convaincre assez pour obtenir une
adresse email. Sont donc réservés à la page Kickstarter elle-même :

- Les paliers de contrepartie chiffrés et les stretch goals.
- Le tableau des frais de port par zone.
- La section risques et défis dans son intégralité.

Ils restent utiles et ne sont pas perdus : ils vivent dans le brief d'origine.

