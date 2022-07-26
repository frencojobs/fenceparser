import {defineBuildConfig} from 'unbuild'

export default defineBuildConfig({
  entries: ['./src/index'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  declaration: true
})
