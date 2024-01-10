document.addEventListener('DOMContentLoaded', function () {
  fetch('apps.json')
    .then(response => response.json())
    .then(apps => {
      renderApps(apps)
      setupOffloadedToggle(apps)
    })
    .catch(error => console.error('Error loading apps:', error))
})

function renderApps(apps) {
  const appsList = document.getElementById('apps-list')
  appsList.innerHTML = '' // Clear existing content

  apps.forEach(app => {
    const appCard = document.createElement('div')
    appCard.className = 'app-card' + (app.offloaded ? ' offloaded' : '')
    appCard.textContent = app.name
    appsList.appendChild(appCard)
  })
}

function setupOffloadedToggle(apps) {
  const toggle = document.getElementById('toggle-offloaded')
  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      renderApps(apps)
    } else {
      renderApps(apps.filter(app => !app.offloaded))
    }
  })
}
