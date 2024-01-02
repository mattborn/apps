const currentOS = '17.2.1'
const systemApps = [
  'Calculator',
  'Camera',
  'Clock',
  'Files',
  'Freeform',
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
  const cleanName = parse[1].replace(/\u200E/g, '') // removes LTR mark
  return { name: cleanName, version: parse[2] }
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
    app.note = app.note || ''
    app.offloaded = app.offloaded || false
    app.recurring = app.recurring || 0
    app.tags = app.tags || ['Archive']
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
