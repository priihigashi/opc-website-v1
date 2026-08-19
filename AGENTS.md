# OPC Website Working Rules

## Restart and handoff safety

When Priscila says she will restart the computer, end the chat, or continue the website in a new chat:

1. Stop starting new changes and inspect the complete working tree.
2. Verify the work completed so far in proportion to its risk.
3. Commit every intentional website change. Never include unrelated user files.
4. Push the active working branch to `origin` and verify that the remote branch resolves to the same commit as local `HEAD`.
5. Report the branch name, commit hash, verification result, and any intentionally uncommitted files.
6. Leave a concise restart-safe handoff naming the current candidate, protected fallback, unfinished work, and the command or URL needed to resume.

A local development URL is temporary and may stop after a restart. GitHub is the durable code backup. Pushing a working branch does not authorize merging to the protected branch, deploying to Vercel, changing the real domain, or changing DNS; those actions still require Priscila's explicit approval.

During ordinary work, local development remains the fast preview environment. Create small verified commits at meaningful checkpoints so a restart never risks more than the current in-progress edit.
