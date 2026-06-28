const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwW1x1hX-F0iQv6KFiY6NMefb09wb0pxrafd1JxlldOW6PZV9fUWV6WWWU92ODYjNsn/exec';

export async function sendLeadToSheets({ matricule, name, gender, age, email }) {
  if (!email && !name) return;
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ matricule, name, gender, age, email }),
    });
  } catch {}
}
