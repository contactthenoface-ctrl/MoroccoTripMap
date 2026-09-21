#!/bin/bash
echo "=================================================="
echo "🚀 Surveillance automatique de MoroccoTripMap"
echo "Dès qu'un fichier est créé ou modifié, l'envoi"
echo "vers GitHub se fera automatiquement."
echo "=================================================="

while true; do
  # Vérifier si Git détecte un changement dans le dossier
  if [ -n "$(git status --porcelain)" ]; then
    echo ""
    echo "📝 Nouveauté/Modification détectée à $(date '+%H:%M:%S') !"
    echo "⏳ Pause de 3 secondes pour finaliser l'enregistrement..."
    sleep 3
    echo "⬆️ Envoi automatique vers GitHub..."
    git add .
    git commit -m "Auto-update : $(date '+%Y-%m-%d %H:%M:%S')"
    git push
    echo "✅ Publié ! GitHub Actions génère la traduction en arrière-plan."
    echo "--------------------------------------------------"
  fi
  sleep 5
done
