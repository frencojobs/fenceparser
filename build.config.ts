import esbuild from 'esbuild'
import fs from 'fs/promises'
import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  declaration: true,
  hooks: {
    // hook to minify
    'build:done': async ({buildEntries}) => {
      for (const entry of buildEntries) {
        const source = await fs.readFile(entry.path, 'utf8')
        const minified = await esbuild.transform(source, {minify: true})
        await fs.writeFile(entry.path, minified.code)
      }
    },
  },
})
