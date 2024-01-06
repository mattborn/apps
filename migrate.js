// Running this node script moves from apps.csv. to apps.json

const fs = require('fs')
const Papa = require('papaparse')
const {
  parseAppName,
  handleSystemApps,
  markOffloaded,
  scaffoldProperties,
  sortProperties,
} = require('./utils')

// Read apps.json file
let apps = []
const jsonPath = './apps.json'
if (fs.existsSync(jsonPath)) {
  apps = JSON.parse(fs.readFileSync(jsonPath))
} else {
  console.error('Could not find JSON file')
}

// Function to update the JSON file
const updateJsonFile = AppList => {
  const today = new Date(Date.now() - 25200000).toISOString().split('T')[0] // YYYY-MM-DD MST

  for (let app of AppList) {
    if (!app['App Name']) continue // prevent undefined keys
    const { name, version } = parseAppName(app['App Name'])

    const existingApp = apps.find(a => a.name === name)
    if (!existingApp) {
      apps.push({
        added: today,
        name,
        seller: app['Seller'],
        version,
      })
    } else if (existingApp.added !== today && existingApp.version !== version) {
      existingApp.updated = today
      existingApp.version = version
    }
  }
  handleSystemApps(apps)
  markOffloaded(AppList, apps)
  scaffoldProperties(apps)
  apps = apps.map(app => sortProperties(app))
  apps.sort((a, b) => a.name.localeCompare(b.name))

  try {
    fs.writeFileSync(jsonPath, JSON.stringify(apps, null, 2))
  } catch (error) {
    console.error(error)
  }
}

// Read and parse CSV
const csv = fs.readFileSync('./apps.csv', 'utf-8')

Papa.parse(csv, {
  header: true,
  complete: results => {
    updateJsonFile(results.data)
    console.log('CSV successfully processed')
  },
})
