"""
Restore leccion3_4.html from git and apply Alt E3 migration.
Run: python docs/scratch/migrate_concept_review.py
"""
import subprocess, os

BASE = r"c:\Users\Carmelo Allende\.antigravity\Docencia_4.0"
os.chdir(BASE)

# 1. Create backups dir
backup_dir = os.path.join(BASE, "docs", "backups", "concept_review_e3")
os.makedirs(backup_dir, exist_ok=True)

# 2. Restore leccion3_4.html from git
subprocess.run(["git", "checkout", "HEAD", "--", "docencia-4.0/leccion3_4.html"], check=True)
print("✓ leccion3_4.html restored from git")

# 3. Create backups of all files
import shutil
files_to_backup = [
    "docencia-4.0/leccion1_1.html",
    "docencia-4.0/leccion1_2.html",
    "docencia-4.0/leccion1_3.html",
    "docencia-4.0/leccion2_1.html",
    "docencia-4.0/leccion2_2.html",
    "docencia-4.0/leccion2_3.html",
    "docencia-4.0/leccion3_1.html",
    "docencia-4.0/leccion3_2.html",
    "docencia-4.0/leccion3_3.html",
    "docencia-4.0/leccion3_4.html",
    "docencia-4.0/styles/main.css",
]
for f in files_to_backup:
    src = os.path.join(BASE, f)
    dst = os.path.join(backup_dir, os.path.basename(f))
    shutil.copy2(src, dst)
    print(f"  backup: {os.path.basename(f)}")

print("✓ All backups created")
print(f"  Location: {backup_dir}")
