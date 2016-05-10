eval "$(ssh-agent -s)"

ssh-add /app/.ssh/githubssh

git clone "$1"
