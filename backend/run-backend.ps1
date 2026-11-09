# Arranca el backend de COCO cargando backend\.env (Spring no lo lee por sí solo).
# Uso:  cd backend ; .\run-backend.ps1 [-Port 8080]
# Las líneas del .env se leen como texto (no se ejecutan) y los valores no se imprimen.
param([int]$Port = 0)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

$envFile = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path -LiteralPath $envFile)) { throw "No existe $envFile (copia .env.example y complétalo)." }

foreach ($line in Get-Content -LiteralPath $envFile -Encoding UTF8) {
    if ($line -match '^\s*#' -or $line -notmatch '=') { continue }
    $name, $value = $line -split '=', 2
    $name = $name.Trim()
    if ($name) { [Environment]::SetEnvironmentVariable($name, $value.TrimEnd("`r"), 'Process') }
}
if ($Port -gt 0) { $env:SERVER_PORT = "$Port" }

foreach ($required in 'SPRING_PROFILES_ACTIVE', 'DB_URL', 'DB_USERNAME', 'DB_PASSWORD', 'JWT_SECRET') {
    if (-not [Environment]::GetEnvironmentVariable($required, 'Process')) { throw "Falta $required en .env" }
}
Write-Host "Perfil: $env:SPRING_PROFILES_ACTIVE | Puerto: $(if ($env:SERVER_PORT) { $env:SERVER_PORT } else { 8080 }) | GEMINI_API_KEY: $(if ($env:GEMINI_API_KEY) { 'definida' } else { 'NO definida' })"

# Compila y obtiene el classpath con Maven.
$mvnw = Join-Path $PSScriptRoot 'mvnw.cmd'
& $mvnw -q compile
if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación.' }
& $mvnw -q dependency:build-classpath '-Dmdep.outputFile=target\cp.txt' '-Dmdep.includeScope=runtime'
if ($LASTEXITCODE -ne 0) { throw 'No se pudo calcular el classpath.' }

# Maven no puede arrancar la app si la ruta del proyecto tiene caracteres como la ñ:
# se copian las clases a una carpeta temporal con ruta simple y se lanza Java directamente.
$run = Join-Path ([System.IO.Path]::GetTempPath()) 'coco-backend-run'
New-Item -ItemType Directory -Force -Path $run | Out-Null
robocopy (Join-Path $PSScriptRoot 'target\classes') (Join-Path $run 'classes') /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
$classpath = (Join-Path $run 'classes') + ';' + (Get-Content -LiteralPath (Join-Path $PSScriptRoot 'target\cp.txt') -Encoding UTF8 -Raw).Trim()

# CLASSPATH como variable de entorno (Unicode) en vez de -cp: PowerShell 5.1 deforma los argumentos con ñ.
$env:CLASSPATH = $classpath
& java com.coco.backend.CocoApplication
