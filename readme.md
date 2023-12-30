# Apps

A seasonal, digital housekeeping tool to keep track of and organize all the apps I’ve downloaded and whether I need to keep them on my device.

## Getting started

1. Download Apple Configurator from the App Store (Yes, it is poorly rated)
2. Connect and open your device from the first screen
3. Actions > Export > Info > Device Information > Installed Apps
4. Save CSV to apps.csv in this directory (ignored by git)
5. Run `node migrate.js`

Any manual edits to the JSON will be preserved on subsequent migrations.
