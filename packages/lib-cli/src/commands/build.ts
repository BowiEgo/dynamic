import webpack from 'webpack'
import inquirer from 'inquirer'
import { VueLoaderPlugin } from 'vue-loader'
// import chokidar from 'chokidar'
import { ora, consola } from '../common/logger'
import { join, relative } from 'path'
import { remove, copy, readdirSync } from 'fs-extra'
import { ROOT, SRC_DIR, ES_DIR, DIST_DIR } from '../common/constant'
import {
  isDir,
  // isSfc,
  // isAsset,
  // isStyle,
  // isScript,
  // isDemoDir,
  // isTestDir,
  // setNodeEnv,
} from '../common'
import { WebpackConfig } from '../common/types'

interface promptAnswer {
  files: string[]
}

const CSS_LOADERS = [
  'style-loader',
  'css-loader',
  {
    loader: 'postcss-loader',
  },
]

function generateWebpackCfg(filenames: Array<string>): WebpackConfig {
  const config: any = {
    entry: {},
    output: {
      filename: `[name].js`,
      chunkFilename: 'chunk.js',
      path: DIST_DIR,
      libraryTarget: 'system',
      // umdNamedDefine: true,
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
        chunks: 'all',
      },
    },
    externals: {
      vue: 'vue',
      lodash: 'lodash',
    },
  }

  filenames.map(filename => {
    config.entry[filename] = join(join(SRC_DIR, filename), 'index.js')
  })
  return config
}

async function compileDir(filenames: Array<string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const config = generateWebpackCfg(filenames)

    // console.log('config', config)

    webpack(config, (err: any, stats: any) => {
      if (err || stats.hasErrors()) {
        if (stats?.hasErrors()) {
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

    let filenames: string[] = []

    const filesMap = files.map(filename => {
      return {
        name: filename,
      }
    })

    inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Choose files to compile',
          name: 'files',
          choices: [new inquirer.Separator(' = Components = '), ...filesMap],
          validate(answer: any) {
            if (answer.length < 1) {
              return 'You must choose at least one file.'
            }

            return true
          },
        },
      ])
      .then(async (answers: promptAnswer) => {
        console.log(answers)
        // await Promise.all(
        answers.files.map(filename => {
          const filePath = join(SRC_DIR, filename)

          // if (isDemoDir(filePath) || isTestDir(filePath)) {
          //   return remove(filePath)
          // }

          const DIR_EXCLUDES = ['utils', 'assets']

          if (isDir(filePath) && !DIR_EXCLUDES.includes(filename)) {
            filenames.push(filename)
          }
        })
        // )
        await compileDir(filenames)
        consola.success('Compile successfully')
      })
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
