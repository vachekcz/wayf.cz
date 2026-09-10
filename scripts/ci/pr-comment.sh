#!/usr/bin/env bash
set -euo pipefail

# Adapted from dotidot-com: update only this workflow bot's marked comment.
marker='<!-- ci-preview -->'
pr_number="${1:?Missing PR number}"
comment_file="${2:?Missing Markdown file}"
[[ "$pr_number" =~ ^[1-9][0-9]*$ ]] || { echo 'Invalid PR number' >&2; exit 1; }
[[ "$(head -n 1 "$comment_file")" == "$marker" ]] || { echo 'Missing comment marker' >&2; exit 1; }

# A cancelled or slow older run must not overwrite a newer commit's result.
current=$(gh api "repos/${GITHUB_REPOSITORY}/pulls/${pr_number}" --jq '.state + " " + .head.sha')
if [[ "$current" != "open ${HEAD_SHA:?Missing PR head SHA}" ]]; then
  echo 'Skip comment: PR closed or head changed'
  exit 0
fi

existing=$(gh api "repos/${GITHUB_REPOSITORY}/issues/${pr_number}/comments" --paginate \
  --jq '.[] | select(.user.login == "github-actions[bot]" and (.body | startswith("<!-- ci-preview -->"))) | .id' \
  | sed -n '1p')
if [[ -n "$existing" ]]; then
  gh api --method PATCH "repos/${GITHUB_REPOSITORY}/issues/comments/${existing}" -F body=@"$comment_file" --silent
else
  gh api --method POST "repos/${GITHUB_REPOSITORY}/issues/${pr_number}/comments" -F body=@"$comment_file" --silent
fi
