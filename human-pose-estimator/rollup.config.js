import replace from 'rollup-plugin-replace'
import json from 'rollup-plugin-json'

const jsonPlugin = json({
  include: 'package.json',
  preferConst: true,
  indent: '  ',
  compact: true,
  namedExports: ['version']
})

export default [
  {
    input: 'src/human-pose-estimator.js',
    output: [
      {
        format: 'iife',
        compact: true,
        name: 'poseEstimator',
        file: 'dist/max.humanpose.js'
      },
      {
        format: 'es',
        compact: true,
        name: 'poseEstimator',
        file: 'dist/max.humanpose.es.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': true
      }),
      jsonPlugin
    ]
  }, {
    input: 'src/human-pose-estimator.js',
    output: [
      {
        format: 'cjs',
        compact: true,
        name: 'poseEstimator',
        file: 'dist/max.humanpose.cjs.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': false
      }),
      jsonPlugin
    ]
  }
]
