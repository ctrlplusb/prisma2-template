const {
  ensureDatabaseExists,
} = require('@prisma/lift/dist/utils/ensureDatabaseExists')
const execa = require('execa')
const chokidar = require('chokidar')

const runCmd = cmd => {
  const [proc, ...args] = cmd.split(' ')
  return execa(proc, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  })
}

let graphqlServerProcess

const killGraphQLServerProcess = () =>
  new Promise(resolve => {
    if (graphqlServerProcess == null) {
      resolve()
    }
    graphqlServerProcess.kill('SIGTERM', {
      forceKillAfterTimeout: 1000,
    })
    graphqlServerProcess.on('exit', () => resolve())
  })

async function generatePhoton() {
  try {
    await runCmd('node_modules/.bin/prisma2 generate')
  } catch (err) {
    console.log(err.message)
  }
}

async function migrateDatabase() {
  try {
    await runCmd('node_modules/.bin/rimraf prisma/migrations')
    await runCmd('node_modules/.bin/rimraf prisma/dev.db')
    await ensureDatabaseExists('dev', true, true)
    await runCmd('node_modules/.bin/prisma2 lift save -n migration')
    await runCmd('node_modules/.bin/prisma2 lift up --auto-approve')
  } catch (err) {
    console.log(err.message)
  }
}

async function transpileNexus() {
  try {
    await runCmd('node_modules/.bin/ts-node --transpile-only src/schema')
  } catch (err) {
    console.log(err.message)
  }
}

const createWatcher = (paths, onChange) => {
  const watcher = chokidar.watch(paths, {
    ignored: 'src/generated',
    ignoreInitial: true,
  })
  watcher
    .on('add', onChange)
    .on('change', onChange)
    .on('unlink', onChange)
    .on('unlinkDir', onChange)
  return watcher
}

let prismaSchemaWatcher
let nexusSchemaWatcher

migrateDatabase()
  .then(() => generatePhoton())
  .then(() => transpileNexus())
  .then(() => {
    graphqlServerProcess = runCmd(
      'node_modules/.bin/ts-node-dev --transpileOnly --respawn src/server',
    )
    graphqlServerProcess.catch(async err => {
      console.log(err.message)
      process.exit(1)
    })
    prismaSchemaWatcher = createWatcher(['prisma/schema.prisma'], () =>
      migrateDatabase().then(() => generatePhoton()),
    )
    nexusSchemaWatcher = createWatcher(
      ['src/schema.ts', 'src/types/**/*'],
      transpileNexus,
    )
  })

process.on('SIGTERM', () => {
  prismaSchemaWatcher.unwatch()
  nexusSchemaWatcher.unwatch()
  killGraphQLServerProcess.then(() => {
    process.exit(0)
  })
})
