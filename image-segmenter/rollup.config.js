import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

const jsonPlugin = json({
  include: 'package.json',
  preferConst: true,
  indent: '  ',
  compact: true,
  namedExports: ['version']
})

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
      }),
      jsonPlugin
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
      }),
      jsonPlugin
    ]
  }
]
