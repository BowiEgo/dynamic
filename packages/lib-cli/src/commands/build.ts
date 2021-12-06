const rollup = require('rollup')
import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import css from 'rollup-plugin-css-only'
// import chokidar from 'chokidar'
// import { rollup } from 'rollup'
import { ora, consola } from '../common/logger'
import { join, relative } from 'path'
import { remove, copy, readdirSync } from 'fs-extra'
import { ROOT, SRC_DIR, ES_DIR } from '../common/constant'
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

function generateInputOpts(path: string, filename: string) {
  return {
    input: join(path, 'index.js'),
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      commonjs(),
      vue({ css: false }),
      css({ output: `style/${filename}.css` }),
    ],
  }
}

function generateOutputOpts(filename: string) {
  return {
    file: `dist/${filename}-umd.js`,
    format: 'umd',
    name: filename,
  }
}

async function compileDir(dir: string, filename: string) {
  const inputOptions = generateInputOpts(dir, filename)
  const outputOptions = generateOutputOpts(filename)

  const bundle = await rollup.rollup(inputOptions)
  await bundle.write(outputOptions)
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

        if (isDir(filePath) && filename !== 'utils') {
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

export async function build(cmd: { watch?: boolean } = {}) {
  console.log('cmd', cmd)
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
