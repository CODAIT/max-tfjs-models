import replace from 'rollup-plugin-replace'

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
      })
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
      })
    ]
  }
]
