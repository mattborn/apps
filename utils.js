const currentOS = '17.2.1'
const systemApps = [
  'Calculator',
  'Camera',
  'Clock',
  'Messages',
  'Notes',
  'Phone',
  'Photos',
  'Safari',
  'Settings',
]

const parseAppName = appName => {
  if (!appName) return false
  const parse = appName.match(/(.*?)\s*\(([\d.]+)\)$/)
  return { name: parse[1], version: parse[2] }
}

const handleSystemApps = apps => {
  systemApps.forEach(systemAppName => {
    let foundApp = apps.find(app => app.name === systemAppName)
    if (!foundApp) {
      apps.push({ name: systemAppName, version: currentOS })
    } else foundApp.version = currentOS
  })
}

const markOffloaded = (csvApps, jsonApps) => {
  const csvAppNames = csvApps.map(app => parseAppName(app['App Name']).name)
  jsonApps.forEach(app => {
    if (!csvAppNames.includes(app.name) && !systemApps.includes(app.name)) {
      app.offloaded = true
    }
  })
}

const scaffoldProperties = apps => {
  apps.forEach(app => {
    app.essential = app.essential || false
    app.frequency = app.frequency || 'rarely'
    app.offloaded = app.offloaded || false
    app.recurring = app.recurring || 0
  })
}

const sortProperties = obj => {
  return Object.keys(obj)
    .sort()
    .reduce((sorted, key) => {
      sorted[key] = obj[key]
      return sorted
    }, {})
}

module.exports = {
  parseAppName,
  handleSystemApps,
  markOffloaded,
  scaffoldProperties,
  sortProperties,
}