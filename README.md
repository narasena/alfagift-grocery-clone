# 1. How to use commitlint:

Commit message type:

**`chore`**: Changes that don't modify source code or tests but relate to the build process, tooling, or other maintenance tasks

**`feat`**: New features

**`fix`**: Bug fixes

**`docs`**: Documentation changes

**`style`**: Code style changes (formatting, semicolons, etc.)

**`refactor`**: Code changes that neither fix bugs nor add features

**`test`**: Adding or fixing tests

**`build`**: Changes affecting build system or dependencies

**`ci`**: Changes to CI configuration files and scripts

**`perf`**: Performance improvements

# 2. Folder Structures:

For references:

## 2.1 Web (Next.js) Structure

```
finpro-web/
├── public/                  # Static assets
│   ├── images/              # Image assets
│   └── fonts/               # Font files
├── src/
│   ├── app/                 # App router pages
│   │   ├── (auth)/          # Auth-related routes (grouped)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/       # Dashboard routes
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable components
│   │   ├── ui/              # UI components (buttons, inputs, etc.)
│   │   ├── forms/           # Form components
│   │   └── layouts/         # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Library code
│   │   └── utils.ts         # Utility functions
│   ├── services/            # API service functions
│   │   ├── api.ts           # Axios instance setup
│   │   └── auth.service.ts  # Auth-related API calls
│   ├── store/               # State management
│   │   └── slices/          # Redux slices or context
│   └── types/               # TypeScript type definitions
├── tailwind.config.js       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```
## 2.2 Api (Express) Structure
```
finpro-api/
├── prisma/                  # Prisma ORM
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/              # Data models (if not using Prisma)
│   ├── repositories/        # Data access layer
│   │   └── user.repository.ts
│   ├── routers/             # Route definitions
│   │   ├── auth.router.ts
│   │   └── user.router.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── utils/               # Utility functions
│   │   ├── jwt.util.ts
│   │   └── password.util.ts
│   ├── validators/          # Request validation schemas
│   │   └── auth.validator.ts
│   ├── app.ts               # Express app setup
│   ├── config.ts            # Configuration
│   └── index.ts             # Entry point
├── tests/                   # Test files
├── vercel.json              # Vercel deployment config
└── tsconfig.json            # TypeScript configuration

```

# 3. Git Workflows
## 3.1 Branch Naming Convention
Always name your branch following this pattern:
```
<name>-<feature-description>
```
Examples:
    `jesse-user-authentication`
    `seno-product-management`
    `azka-add-to-cart`

For sub-features, you can create branches from feature branches:
```
git checkout -b <name>-<sub-feature> <parent-feature-branch>
```
Example:
```
git checkout -b azka-order-notifications azka-order-management
```

## 3.2 Daily Workflow
### 3.2.1 Always Get Latest Change from main
```
git checkout main
git pull origin main
```
### 3.2.2 Development
```
#Create new branch
git checkout -b <name>-<feature-name>

#If branch already exists
git checkout <name>-<feature-name>
git pull origin <name>-feature-name>

#Save your changes
git add .
git commit -m "feat: description of your changes"

#Push your change to remote (1st time only) for set upstream branch
git push -u origin <name>-<feature-name>

#Push your change to existing remote
git push
```
### 3.2.3 Keeping Your Branch Updated with Main
```
# Get latest changes from main
git checkout main
git pull origin main

# Update your feature branch
git checkout <name>-<feature-name>
git merge main

# Resolve any conflicts if they occur
# Then push your updated branch
git push origin <name>-<feature-name>
```

### 3.2.4 If you finish your feature
**1. Preparing for Pull Request**
```
# Make sure your branch is up to date with main
git checkout main
git pull origin main
git checkout <name>-<feature-name>
git merge main

# Resolve any conflicts
git add .
git commit -m "chore: resolve merge conflicts"

# Push final changes
git push origin <name>-<feature-name>
```
**2. Creating a Pull Request (On Github)**
```
    1. Go to the repository on GitHub
    2. Click "Pull requests" tab
    3. Click "New pull request"
    4. Set "base" to main and "compare" to your feature branch
    5. Click "Create pull request"
    6. Add a descriptive title and description
    7. Assign reviewers (team lead)
    8. Submit the pull request
```
### 3.2.5 Stashing Changes (You need to switch branch but have uncommited changes)
```
# Save your changes to stash
git stash save "work in progress on feature X"

# Pull latest changes or switch branches
git checkout main
git pull origin main

# Return to your branch
git checkout <name>-<feature-name>

# Apply your stashed changes
git stash apply

# Or apply and remove from stash
git stash pop

# List all stashes
git stash list

# Apply specific stash (n is the stash number)
git stash apply stash@{n}
```
### 3.2.6 Handling Merge Conflicts
When Git can't automatically merge changes:
```
# When a merge conflict occurs, Git will tell you which files are conflicted
# Open those files and look for conflict markers:
# <<<<<<< HEAD (current changes)
# your code
# =======
# incoming code
# >>>>>>> branch-name (incoming changes)

# Edit the files to resolve conflicts by choosing which changes to keep

# After resolving, mark as resolved
git add <resolved-file>

# Complete the merge
git commit -m "chore: resolve merge conflicts"
```

### 3.2.7 Undoing Mistakes (Only when necessary)
```
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1

# Undo changes in a specific file
git checkout -- <filename>

# Undo all unstaged changes
git checkout -- .

# Amend last commit message
git commit --amend -m "New commit message"

# Add forgotten files to last commit
git add <forgotten-file>
git commit --amend --no-edit
```
### 3.2.8 Viewing History and Changes
```
# View commit history
git log

# View commit history with graph
git log --graph --oneline --all

# See changes in a file
git diff <filename>

# See changes between commits
git diff <commit-hash1>..<commit-hash2>

# See who changed a line in a file
git blame <filename>
```
### 3.2.9 Emergency Hotfix
```
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix-<issue-description>

# Make your fixes
git add .
git commit -m "fix: description of the hotfix"

# Push and create PR for immediate review
git push -u origin hotfix-<issue-description>
```

### 3.2.10 Cleaning Up After Merge
```
# After your PR is merged, update local main
git checkout main
git pull origin main

# Delete your local feature branch
git branch -d <name>-<feature-name>

# Delete remote feature branch
git push origin --delete <name>-<feature-name>
```
# 4. Run Docker for This Project
### 4.1 Install Docker Desktop
    * Download from [Docker's official website](https://www.docker.com/products/docker-desktop/)
    * Follow the installation instruction
### 4.2 Start Docker Desktop:
    * After installation, launch Docker Desktop
    * Wait for it to start (you'll see the Docker icon in your system tray)
### 4.3 Run Docker Setup:
    * Open a command prompt or PowerShell or Docker built-in terminal
    * Navigate to the project root directory:
    ```
    cd ...\...\finpro-grocery
    ```
    * Run the following command to build and start your containers
    ```
    docker-compose up -d --build
    ```
### 4.4 Check if containers are running:
    ```
    docker ps
    ```
    * This will show you the running containers.
    * Or check in containers tab on the sidebar and check whether the containers are running
    * Click on the name will show the details
### 4.5 How to access the application
    * API: http://localhost:8001
    * Web: http://localhost:3001
    * Using 3001 and 8001 to avoid conflicting port if you wish still to run on vscode terminal which is still 3000 and 8000
### 4.6 Stop the containers when you're done
    ```
    docker-compose down
    ```
### 4.7 When to rebuild containers
    1. **For most code changes**: You don't need to rebuild the container. The volume mount creates a link between your local code and the container, so changes to your source files are immediately available inside the container.

    2. 
    Using
    ```
    docker-compose up -d --build
    ```
    only when,
        * You modify Dockerfile itself,
        * Add/install new dependencies (package) that change package.json
        * Change configuration files that are read only at startup
    
    3. If you're not seeing your changes reflected, you might need to restart the service without rebuilding
    ```
    docker-compose restart web
    ```


