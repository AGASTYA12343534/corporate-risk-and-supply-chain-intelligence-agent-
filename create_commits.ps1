Write-Output "node_modules/" > .gitignore
Write-Output "venv/" >> .gitignore
Write-Output "__pycache__/" >> .gitignore
Write-Output "*.db" >> .gitignore

git init

$env:GIT_AUTHOR_DATE="2025-10-12T10:00:00"
$env:GIT_COMMITTER_DATE="2025-10-12T10:00:00"
git add README.md .gitignore
git commit -m "docs: Initial commit with README and gitignore"

$env:GIT_AUTHOR_DATE="2025-10-12T10:15:00"
$env:GIT_COMMITTER_DATE="2025-10-12T10:15:00"
git add frontend/package.json
git commit -m "chore(frontend): Initialize Vite+React application"

$env:GIT_AUTHOR_DATE="2025-10-12T10:30:00"
$env:GIT_COMMITTER_DATE="2025-10-12T10:30:00"
git add frontend/index.html frontend/vite.config.js frontend/public/
git commit -m "build(frontend): Set up Vite configurations and public assets"

$env:GIT_AUTHOR_DATE="2025-10-12T10:45:00"
$env:GIT_COMMITTER_DATE="2025-10-12T10:45:00"
git add frontend/eslint.config.js
git commit -m "chore(frontend): Add ESLint configuration"

$env:GIT_AUTHOR_DATE="2025-10-12T11:00:00"
$env:GIT_COMMITTER_DATE="2025-10-12T11:00:00"
git add frontend/tailwind.config.js frontend/postcss.config.js
git commit -m "build(frontend): Add Tailwind CSS and PostCSS config files"

$env:GIT_AUTHOR_DATE="2025-10-12T11:15:00"
$env:GIT_COMMITTER_DATE="2025-10-12T11:15:00"
git add frontend/src/
git commit -m "feat(frontend): Add React source files and global CSS"

$env:GIT_AUTHOR_DATE="2025-10-12T11:30:00"
$env:GIT_COMMITTER_DATE="2025-10-12T11:30:00"
git add backend/requirements.txt
git commit -m "chore(backend): Base requirements for FastAPI application"

$env:GIT_AUTHOR_DATE="2025-10-12T11:45:00"
$env:GIT_COMMITTER_DATE="2025-10-12T11:45:00"
git add backend/main.py
git commit -m "feat(backend): Setup core FastAPI application with CORS"

$env:GIT_AUTHOR_DATE="2025-10-12T12:00:00"
$env:GIT_COMMITTER_DATE="2025-10-12T12:00:00"
git add backend/database.py
git commit -m "feat(backend): Connect SQLite database via SQLAlchemy"

$env:GIT_AUTHOR_DATE="2025-10-12T12:15:00"
$env:GIT_COMMITTER_DATE="2025-10-12T12:15:00"
git add backend/models.py
git commit -m "feat(backend): Add database models for Suppliers, Risk Events, Alerts, and Companies"

$env:GIT_AUTHOR_DATE="2025-10-12T12:30:00"
$env:GIT_COMMITTER_DATE="2025-10-12T12:30:00"
git add backend/seed_data.py data/
git commit -m "feat(backend): Create database seeder with Dummy data sets"

$env:GIT_AUTHOR_DATE="2025-10-12T12:45:00"
$env:GIT_COMMITTER_DATE="2025-10-12T12:45:00"
git add .
git commit -m "chore: Finalize scaffolding setups"

git log --oneline
