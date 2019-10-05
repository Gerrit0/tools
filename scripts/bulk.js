//@ts-check
const glob = require('fast-glob')
const fs = require('fs').promises
const { dfaToGraph } = require('../dist/dfa_to_graph')

/**
 * @param {string} func
 * @param {string[]} args
 */
async function main(func, args) {
  const files = await glob(args)

  switch (func) {
    case "d2g":
      await Promise.all(files.map(async file => {
        console.log(file)
        const text = await fs.readFile(file, 'ascii')
        return fs.writeFile(file.replace('.fa', '.dot'), dfaToGraph(text))
      }))
      break
    default:
      throw new Error(`Command ${func} not recognized.`)
  }
}

main(process.argv[2], process.argv.slice(3))
  .then(() => console.log('Done'))
  .catch(console.error)
