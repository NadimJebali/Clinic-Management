# Git Setup Guide

## Setting Up Git Credentials

### Option 1: Using Git Config (Recommended for Beginners)

1. Set your name and email:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

2. Store credentials temporarily (cached for 1 hour):

```bash
git config --global credential.helper 'cache --timeout=3600'
```

3. Or store credentials permanently (plain text):

```bash
git config --global credential.helper store
```

### Option 2: Using SSH Keys (More Secure)

1. Generate SSH key:

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

2. Start SSH agent:

```bash
eval "$(ssh-agent -s)"
```

3. Add SSH key:

```bash
ssh-add ~/.ssh/id_ed25519
```

4. Copy public key:

```bash
cat ~/.ssh/id_ed25519.pub
```

5. Add to GitHub:

   - Go to GitHub.com → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste the key
   - Save

6. Change remote URL to SSH:

```bash
git remote set-url origin git@github.com:NadimJebali/Clinic-Management.git
```

## Fixing the Push Error

Your error happened because the remote repository has changes that you don't have locally.

### Solution 1: Pull and Merge (Recommended)

```bash
# Pull changes from remote
git pull origin main

# If there are conflicts, resolve them, then:
git add .
git commit -m "Resolved merge conflicts"

# Push your changes
git push origin main
```

### Solution 2: Pull and Rebase

```bash
# Rebase your changes on top of remote changes
git pull --rebase origin main

# If there are conflicts, resolve them, then:
git add .
git rebase --continue

# Push your changes
git push origin main
```

### Solution 3: Force Push (Use with Caution!)

⚠️ **WARNING**: This will overwrite remote changes. Only use if you're sure!

```bash
git push --force origin main
```

## Common Git Commands

### Check Status

```bash
git status
```

### Add All Changes

```bash
git add .
```

### Commit Changes

```bash
git commit -m "Your commit message"
```

### Push to Remote

```bash
git push origin main
```

### Pull from Remote

```bash
git pull origin main
```

### View Commit History

```bash
git log --oneline
```

### View Remote URL

```bash
git remote -v
```

## Recommended Workflow

1. **Before starting work**:

```bash
git pull origin main
```

2. **Make your changes**

3. **Stage changes**:

```bash
git add .
```

4. **Commit changes**:

```bash
git commit -m "Descriptive message about what you changed"
```

5. **Push changes**:

```bash
git push origin main
```

## Troubleshooting

### Error: "Failed to open secret service session"

This is a credential helper issue. Use one of these solutions:

**Temporary Fix**:

```bash
git config --global credential.helper store
git pull origin main
# Enter credentials when prompted
git push origin main
```

**Permanent Fix (Ubuntu/Debian)**:

```bash
sudo apt update
sudo apt install libsecret-1-0 libsecret-1-dev
cd /usr/share/doc/git/contrib/credential/libsecret
sudo make
git config --global credential.helper /usr/share/doc/git/contrib/credential/libsecret/git-credential-libsecret
```

### Error: "Updates were rejected"

Remote has changes you don't have locally:

```bash
git pull origin main
# Resolve any conflicts
git push origin main
```

### Error: "fatal: not a git repository"

You're not in a git repository:

```bash
git init
git remote add origin https://github.com/NadimJebali/Clinic-Management.git
```

## Best Practices

1. **Commit often** - Small, focused commits are better
2. **Write clear commit messages** - Describe what and why
3. **Pull before push** - Always get latest changes first
4. **Don't commit sensitive files** - Add them to .gitignore
5. **Use branches** - For new features or experiments

## .gitignore

Make sure these are in your `.gitignore`:

```
node_modules/
.next/
.env
.env.local
*.log
.DS_Store
```

## Quick Reference

```bash
# Setup
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Daily workflow
git pull origin main          # Get latest changes
git add .                     # Stage changes
git commit -m "message"       # Commit changes
git push origin main          # Push changes

# Fixing issues
git status                    # Check status
git log                       # View history
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (discard changes)
```

## Need More Help?

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Interactive Git Tutorial](https://learngitbranching.js.org/)
