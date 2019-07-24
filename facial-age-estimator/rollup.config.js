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
    input: 'src/facial-age-estimator.js',
    output: [
      {
        format: 'iife',
        compact: true,
        name: 'ageEstimator',
        file: 'dist/max.ageest.js'
      },
      {
        format: 'es',
        compact: true,
        name: 'ageEstimator',
        file: 'dist/max.ageest.es.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': true
      }),
      jsonPlugin
    ]
  }, {
    input: 'src/facial-age-estimator.js',
    output: [
      {
        format: 'cjs',
        compact: true,
        name: 'ageEstimator',
        file: 'dist/max.ageest.cjs.js'
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
