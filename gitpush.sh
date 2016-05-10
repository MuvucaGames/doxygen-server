eval "$(ssh-agent -s)"

ssh-add "/app/.ssh/githubssh"

git add .

git commit -m "server Documentation"

git push
