const $ = selector => document.querySelector(selector)

document.addEventListener('DOMContentLoaded', () => {
  fetch('apps.json')
    .then(response => response.json())
    .then(apps => {
      renderApps(apps)
      $('#toggle-offloaded').addEventListener('change', event =>
        diminishOffloadedApps(apps, event.target.checked),
      )
    })
    .catch(error => console.error('Error loading apps:', error))
})

const renderApps = apps => {
  const appsList = $('#apps-list')
  appsList.innerHTML = ''

  apps.forEach(app => createAppCard(appsList, app))
}

const createAppCard = (parent, app) => {
  const appCard = document.createElement('div')
  appCard.className = 'app-card' + (app.offloaded ? ' offloaded' : '')

  const appIcon = document.createElement('div')
  appIcon.className = 'app-icon'
  // Future: Replace this with an actual image tag for the icon

  const appInfo = document.createElement('div')
  appInfo.className = 'app-info'
  appInfo.innerHTML = `
  <h2>${app.name}</h2>
  <div>${app.version || 'No version'}</div>
  ${renderTags(app.tags)}
  <div>${app.note ? createLinkFromText(app.note) : 'None'}</div>
  <div>${app.essential ? 'Essential' : 'Non-essential'}</div>
  <div>Frequency: ${app.frequency || 'Unknown'}</div>
  <div>Last updated: ${app.updated || app.added}</div>`

  appCard.appendChild(appIcon)
  appCard.appendChild(appInfo)
  parent.appendChild(appCard)
}

const renderTags = tags => {
  if (!tags || tags.length === 0) return ''
  const tagPills = tags
    .map(tag => `<span class="tag-pill">${tag}</span>`)
    .join(' ')
  return `<div class="tags-container">${tagPills}</div>`
}

const createLinkFromText = text => {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>')
}

const diminishOffloadedApps = (apps, showOffloaded) => {
  const appsList = $('#apps-list')
  appsList.innerHTML = ''

  const filteredApps = showOffloaded ? apps : apps.filter(app => !app.offloaded)
  filteredApps.forEach(app => createAppCard(appsList, app))
}
