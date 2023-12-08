#!/usr/bin/env bash

rm -rf public
git worktree prune
git branch -D gh-pages 2> /dev/null
git worktree add --no-checkout -B gh-pages public origin/gh-pages
hugo

hash="$(git rev-parse --short HEAD)"
branch="$(git rev-parse --abbrev-ref HEAD)"
desc="$(git show --pretty="format:%s" | head -n 1)"

pushd ./public

git add .
git commit -m "Generated site from ${hash} (${branch}) | ${desc}"

read -p "$(tput setaf 4)Do you want to push the gh-pages branch? (y/n) $(tput sgr0)"
[ "$REPLY" == "y" ] && git push

popd
