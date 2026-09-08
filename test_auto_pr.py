from dotenv import load_dotenv
from github_service import create_automated_fix_pr

# .env file se GITHUB_TOKEN load karein
load_dotenv()

# Test Parameters
REPO_NAME = "ibrahimjatt1313-prog/OpsPilot-AI"  
FILE_TO_PATCH = "src/App.css"
TEST_FIX_CODE = "/* Auto-generated fix by OpsPilot AI */\n:root {\n  --bg-primary: #0b0f19;\n}"

try:
    print("⏳ Creating Pull Request via PyGithub...")
    pr_url = create_automated_fix_pr(
        repo_name=REPO_NAME,
        file_path=FILE_TO_PATCH,
        fix_code=TEST_FIX_CODE,
        issue_title="Auto Remediation Test",
        issue_desc="Testing programmatically generated Pull Request via PyGithub service."
    )
    print(f"\n✅ Success! Pull Request automatically created:\n{pr_url}")
except Exception as e:
    print(f"\n❌ Error: {e}")