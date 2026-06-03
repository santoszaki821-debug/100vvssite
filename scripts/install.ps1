param(
  [switch]$Docker
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

if (!(Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host ".env cree depuis .env.example. Modifiez les secrets avant production."
}

if ($Docker) {
  docker compose up --build
  exit
}

npm.cmd install
npm.cmd run db:generate
Write-Host "Installation terminee. Lancez PostgreSQL puis: npm.cmd run db:migrate ; npm.cmd run db:seed ; npm.cmd run dev"
