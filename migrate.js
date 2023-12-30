// Running this node script moves from apps.csv. to apps.json

const fs = require('fs')
const Papa = require('papaparse')

// Read apps.json file
let apps = []
const jsonPath = './apps.json'
if (fs.existsSync(jsonPath)) {
  apps = JSON.parse(fs.readFileSync(jsonPath))
} else {
  console.error('Could find JSON file')
}

// Function to update the JSON file
const updateJsonFile = AppList => {
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

  for (let app of AppList) {
    if (!app['App Name']) continue // prevent undefined keys
    const parse = app['App Name'].match(/(.*?)\s*\(([\d.]+)\)$/)
    const appName = parse[1]
    const version = parse[2]

    const existingApp = apps.find(a => a.name === appName)
    if (!existingApp) {
      apps.push({
        added: today,
        name: appName,
        seller: app['Seller'],
        version: version,
      })
    } else {
      if (existingApp.added !== today) existingApp.updated = today
      if (existingApp.version !== version) existingApp.version = version
    }
  }

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
