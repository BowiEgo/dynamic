import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
import WebpackDevServer from 'webpack-dev-server'
// import chokidar from 'chokidar'
import { ora, consola } from '../common/logger'
import { join, relative } from 'path'
import { remove, copy, readdirSync } from 'fs-extra'
import { ROOT, SRC_DIR, ES_DIR, DIST_DIR } from '../common/constant'
import {
  isDir,
  isSfc,
  isAsset,
  isStyle,
  isScript,
  isDemoDir,
  isTestDir,
  setNodeEnv,
} from '../common'
import { WebpackConfig } from '../common/types'

const CSS_LOADERS = [
  'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
  },
]

function generateWebpackCfg(path: string, filename: string): WebpackConfig {
  return {
    entry: join(path, 'index.js'),
    output: {
      filename: `${filename}.js`,
      path: DIST_DIR,
      libraryTarget: 'umd',
    },
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: CSS_LOADERS,
        },
        {
          test: /\.less$/,
          // sideEffects: true,
          use: [...CSS_LOADERS, 'less-loader'],
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },
    plugins: [new VueLoaderPlugin()],
    resolveLoader: {
      modules: [join(__dirname, '../../node_modules')],
    },
  }
}

async function compileDir(dir: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const config = generateWebpackCfg(dir, filename)
    console.log('config', config)

    webpack(config, (err: any, stats: any) => {
      if (err || stats.hasErrors()) {
        if (stats.hasErrors()) {
          const info = stats.toJson()
          console.error(info.errors)
        }
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function runBuildTasks() {
  try {
    const files = readdirSync(SRC_DIR)

    await Promise.all(
      files.map(filename => {
        const filePath = join(SRC_DIR, filename)

        // if (isDemoDir(filePath) || isTestDir(filePath)) {
        //   return remove(filePath)
        // }

        const DIR_EXCLUDES = ['utils', 'assets']

        if (isDir(filePath) && !DIR_EXCLUDES.includes(filename)) {
          console.log(filePath, 'is directory')
          return compileDir(filePath, filename)
        }

        // return compileFile(filePath)
      }),
    )
    consola.success('Compile successfully')
  } catch (err) {
    console.log(err)
    throw err
  }
}

async function runServer() {
  const server = new WebpackDevServer({
    static: {
      directory: DIST_DIR,
    },
    port: 3000,
  })

  console.log('Starting server...')
  try {
    await server.start()
  } catch (err) {
    console.error(err)
  }
}

export async function serve(cmd: { watch?: boolean } = {}) {
  console.log('cmd', cmd)
  try {
    // await clean()
    // await installDependencies()
    await runBuildTasks()

    // if (cmd.watch) {
    //   watchFileChange()
    // }
    await runServer()
  } catch (err) {
    consola.error('Serve failed')
    process.exit(1)
  }
}
