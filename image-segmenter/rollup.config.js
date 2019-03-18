import replace from 'rollup-plugin-replace'

export default [
  {
    input: 'src/image-segmenter.js',
    output: [
      {
        format: 'iife',
        compact: true,
        name: 'imageSegmenter',
        file: 'dist/max.imgseg.js'
      },
      {
        format: 'es',
        compact: true,
        name: 'imageSegmenter',
        file: 'dist/max.imgseg.es.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': true
      })
    ]
  }, {
    input: 'src/image-segmenter.js',
    output: [
      {
        format: 'cjs',
        compact: true,
        name: 'imageSegmenter',
        file: 'dist/max.imgseg.cjs.js'
      }
    ],
    plugins: [
      replace({
        'process.rollupBrowser': false
      })
    ]
  }
]
