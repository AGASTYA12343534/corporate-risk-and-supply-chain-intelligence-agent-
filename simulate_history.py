import subprocess
import datetime
import os
import sys

def run_cmd(cmd, env=None):
    res = subprocess.run(cmd, env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        print(f"Failed: {' '.join(cmd)}")
        print(res.stderr)
        sys.exit(1)
    return res.stdout.strip()

commits = run_cmd(['git', 'log', '--reverse', '--format=%H']).split('\n')
commits = [c for c in commits if c]

if len(commits) == 0:
    print("No commits found.")
    sys.exit(0)

start_date = datetime.datetime(2025, 10, 12, 10, 0, 0)
end_date = datetime.datetime(2026, 4, 16, 10, 0, 0)
total_commits = len(commits)

print(f"Total commits to rewrite: {total_commits}")

delta = (end_date - start_date) / max(1, (total_commits - 1))

run_cmd(['git', 'checkout', commits[0], '-b', 'simulated-history'])

for i, commit in enumerate(commits):
    current_date = start_date + delta * i
    date_str = current_date.strftime('%Y-%m-%dT%H:%M:%S')
    print(f"Rewriting commit {i+1}/{total_commits} with date {date_str}")
    
    if i > 0:
        res = subprocess.run(['git', 'cherry-pick', commit], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            run_cmd(['git', 'cherry-pick', '--skip'])
    
    env_vars = os.environ.copy()
    env_vars['GIT_COMMITTER_DATE'] = date_str
    env_vars['GIT_AUTHOR_DATE'] = date_str
    
    run_cmd(['git', 'commit', '--amend', '--no-edit', '--date', date_str], env=env_vars)

run_cmd(['git', 'checkout', 'main'])
run_cmd(['git', 'reset', '--hard', 'simulated-history'])
run_cmd(['git', 'branch', '-D', 'simulated-history'])

print("History simulation complete!")
