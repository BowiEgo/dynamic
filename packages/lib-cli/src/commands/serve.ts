const rollup = require('rollup')
import rollupServe from 'rollup-plugin-serve'
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

const resolveFile = function (filePath: any) {
  return join(ROOT, 'dist')
}

const PORT = 3000

const inputOptions = {
  input: join(ROOT, 'src/Comp/index.js'),
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    vue({ css: false }),
    css({ output: 'style/comp.css' }),
    rollupServe({
      port: PORT,
      contentBase: [resolveFile('')],
      allowCrossOrigin: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
  ],
}

const outputOptions = {
  file: 'dist/comp-nomodule.js',
  format: 'umd',
  name: 'Comp',
}

async function runBuildTasks() {
  try {
    const bundle = await rollup.rollup(inputOptions)
    await bundle.write(outputOptions)
    consola.success('Compile successfully')
  } catch (err) {
    console.log(err)
    throw err
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
  } catch (err) {
    consola.error('Serve failed')
    process.exit(1)
  }
}
