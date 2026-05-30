import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

if (!existsSync('.git')) {
  process.exit(0)
}

const hooksPath = spawnSync('git', ['config', '--get', 'core.hooksPath'], {
  encoding: 'utf8',
}).stdout.trim()

if (hooksPath === '.husky/_' && existsSync('.husky/_/h')) {
  process.exit(0)
}

execFileSync('husky', { stdio: 'inherit' })
