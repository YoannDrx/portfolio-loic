# Checklist de déploiement et d'indexation

## Avant la mise en production

- Créer une sauvegarde datée de la base PostgreSQL et vérifier qu'elle peut être restaurée.
- Déployer une Preview avec les mêmes variables d'environnement que la production, sans exposer de secret dans les logs.
- Configurer `RESEND_API_KEY`, `CONTACT_FROM_EMAIL` et `CONTACT_RATE_LIMIT_SECRET`.
- Appliquer la migration additive avec `npx prisma migrate deploy`.
- Exécuter `npm run db:seed` pour rétroremplir les slugs et les tracklists sans écraser les descriptions éditées dans l'administration.
- Contrôler les doublons de slugs, les 21 albums, les 215 pistes et les redirections ID vers slug.
- Tester un envoi de contact réel, sa notification dans l'administration et la réception de l'e-mail.
- Valider la Preview sur mobile et desktop, en français et en anglais, avant de promouvoir le déploiement.

## Après la mise en production

- Vérifier `/robots.txt` et `/sitemap.xml` sur le domaine final.
- Contrôler plusieurs pages dans le test des résultats enrichis Google : accueil, album, service et vidéo.
- Vérifier les canonical, `hreflang`, Open Graph et JSON-LD en français et en anglais.
- Contrôler les redirections permanentes des anciennes URLs par ID et de `/img/cv_loic_ghanem.pdf`.
- Vérifier qu'aucune iframe tierce ne charge avant le consentement média.
- Surveiller les erreurs serveur, les messages de contact et Speed Insights pendant les premières 48 heures.

## Google Search Console

- Soumettre `https://www.loic-ghanem.com/sitemap.xml` dans la propriété du domaine.
- Utiliser l'inspection d'URL pour demander l'indexation de l'accueil, des deux nouveaux albums et des principales pages de services.
- Demander la suppression temporaire de l'ancienne URL du PDF si elle apparaît encore dans l'index. La redirection permanente doit rester active après la demande.
- Examiner les rapports Pages, HTTPS, Signaux Web essentiels et Résultats enrichis après le prochain crawl.
- Corriger d'abord les erreurs d'indexation ou de données structurées ; les avertissements éditoriaux facultatifs peuvent être traités ensuite.

## Critères de contrôle

- LCP au 75e percentile inférieur ou égal à 2,5 s.
- INP au 75e percentile inférieur ou égal à 200 ms.
- CLS au 75e percentile inférieur ou égal à 0,1.
- Page Albums initiale inférieure à 2 Mo.
- Aucune pochette supérieure à 250 Ko.
- Aucun média tiers chargé avant consentement.
