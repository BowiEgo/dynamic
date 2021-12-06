#!/usr/bin/env node
import { Command } from 'commander'

import { build } from './commands/build'
import { serve } from './commands/serve'

const program = new Command()
program.version('0.0.1')

program
  .command('build')
  .description('Compile components in production mode')
  .action(build)

program.command('serve').description('Serve components in development mode').action(serve)

program.parse()
