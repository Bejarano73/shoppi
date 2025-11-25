param([int]$Port = 5055)

try {
  $conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($conn) {
    $pid = $conn.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction Stop
    Write-Output "Killed PID $pid on port $Port"
    exit 0
  }
} catch {}

$netstat = netstat -ano | Select-String ":$Port" | Select-Object -First 1
if ($netstat) {
  $parts = $netstat.ToString().Trim().Split(' ', [System.StringSplitOptions]::RemoveEmptyEntries)
  $pid = $parts[$parts.Length - 1]
  try {
    taskkill /PID $pid /F | Out-Null
    Write-Output "Killed PID $pid on port $Port"
    exit 0
  } catch {
    Write-Output "Failed to kill PID $pid"
    exit 1
  }
}

Write-Output "No process is listening on port $Port"
exit 0
