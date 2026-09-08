import os
from github import Github

def create_automated_fix_pr(repo_name, file_path, fix_code, issue_title, issue_desc):
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        raise ValueError("GITHUB_TOKEN environment variable missing hai! .env file check karein.")

    g = Github(github_token)
    repo = g.get_repo(repo_name)

    # 1. Main branch se base SHA get karein
    main_branch = repo.get_branch("main")
    base_sha = main_branch.commit.sha

    # 2. Unique branch name banayein
    clean_title = issue_title.lower().replace(' ', '-')
    branch_name = f"fix/opspilot-{clean_title}"
    
    # Check karein agar branch pehle se bani hui hai to issue na ho
    try:
        repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base_sha)
    except Exception:
        pass  # Branch already exists

    # 3. File ka current content aur sha get karein
    file_content = repo.get_contents(file_path, ref=branch_name)

    # 4. New code commit karein
    repo.update_file(
        path=file_path,
        message=f"fix(opspilot): {issue_title}",
        content=fix_code,
        sha=file_content.sha,
        branch=branch_name
    )

    # 5. Pull Request open karein
    pr_body = f"""
    ### 🤖 OpsPilot AI - Automated Incident Remediation
    
    **Issue Summary:** {issue_desc}
    
    **Fix Details:**
    - Updated `{file_path}` via Deep Diagnostic Engine logic.
    - Status: Safe fix ready for review and merge.
    """
    
    pr = repo.create_pull(
        title=f"🤖 [OpsPilot AI] Fix: {issue_title}",
        body=pr_body,
        head=branch_name,
        base="main"
    )

    return pr.html_url