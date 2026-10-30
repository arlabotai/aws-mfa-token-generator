🧩 Opción 1 — Configurarlo de forma permanente en PowerShell
✅ Método rápido (recomendado)

Abrí tu PowerShell Profile ejecutando:

notepad $PROFILE


Si te dice que el archivo no existe, crealo cuando te lo pregunte.

Al final del archivo agregá esta línea:

$env:AWS_PROFILE = "default"


Guardá y cerrá.

Ahora, cada vez que abras PowerShell, se setea automáticamente el perfil.
Podés verificarlo con:

echo $env:AWS_PROFILE


Y debería mostrar:

default