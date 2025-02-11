const fs = require('fs')
const appStore = require('app-store-scraper')
const cloudinary = require('cloudinary').v2

// Cloudinary Configuration
// cloudinary.config({
//   cloud_name: 'your_cloud_name',
//   api_key: 'your_api_key',
//   api_secret: 'your_api_secret',
// })

// Function to upload icon to Cloudinary
const uploadIconToCloudinary = async (iconUrl, appName) => {
  try {
    const appId = appName.replace(/\s/g, '_') // Normalize the app name for use as an ID
    const result = await cloudinary.uploader.upload(iconUrl, {
      folder: 'apps',
      public_id: `apps/${appId}`,
    })
    return result.url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return null
  }
}

// Function to fetch and update app icons
const enrichApps = async () => {
  let apps = JSON.parse(fs.readFileSync('apps.json'))

  for (const app of apps) {
    // Only update the icon if the version has changed or if the icon URL is missing
    if (!app.icon || app.version !== app.lastCheckedVersion) {
      try {
        const results = await appStore.search({ term: app.name, num: 1 })
        if (results.length > 0) {
          const iconUrl = await uploadIconToCloudinary(
            results[0].icon,
            app.name,
          )
          app.icon = iconUrl // Add the icon URL
          app.lastCheckedVersion = app.version // Update the last checked version
        }
      } catch (error) {
        console.error(`Error fetching data for ${app.name}:`, error)
      }
    }
  }

  fs.writeFileSync('apps.json', JSON.stringify(apps, null, 2))
}

enrichApps()
