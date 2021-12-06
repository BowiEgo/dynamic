import webpack from 'webpack'
import { VueLoaderPlugin } from 'vue-loader'
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
    entry: {
      main: join(path, 'index.js'),
    },
    output: {
      filename: `${filename}.js`,
      path: DIST_DIR,
      libraryTarget: 'system',
      iife: true,
    },
    mode: 'production',
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
    optimization: {
      splitChunks: {
        chunks: 'async',
        minSize: 2,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
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
          return compileDir(filePath, filename)
        }
      }),
    )
    consola.success('Compile successfully')
  } catch (err) {
    console.log(err)
    throw err
  }
}

export async function build(cmd: { watch?: boolean } = {}) {
  try {
    // await clean()
    // await installDependencies()
    await runBuildTasks()

    // if (cmd.watch) {
    //   watchFileChange()
    // }
  } catch (err) {
    consola.error('Build failed')
    process.exit(1)
  }
}
