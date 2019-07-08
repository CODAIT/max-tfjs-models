import replace from 'rollup-plugin-replace'

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
      })
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
      })
    ]
  }
]
