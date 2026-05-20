# scripts/

Local utility scripts. Run these from the repo root unless noted otherwise.

| Script | Purpose |
|---|---|
| `package-theme.ps1` | Bundle the theme into a clean zip for Shopify Admin upload (excludes `apps-script/`, `docs/`, etc.) |

## Running PowerShell scripts on Windows

If you get an execution policy error the first time:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then run as:

```powershell
.\scripts\package-theme.ps1
```
