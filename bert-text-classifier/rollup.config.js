import node from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import builtins from 'builtin-modules';
import replace from 'rollup-plugin-replace';

const jsonPlugin = json({
  include: './package.json',
  preferConst: true,
  indent: '  ',
  compact: true,
  namedExports: ['version']
})

export default[
  {
    input: 'src/text-sentiment-classifier.ts',
    output: [
      {
        name: 'textSentimentClassifier',
        file: 'dist/src/max.sentimentclass.js',
        format: 'iife',
        sourcemap: true
      },
      {
        name: 'textSentimentClassifier',
        file: 'dist/src/max.sentimentclass.es.js',
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      typescript({
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: 'ES2015',
            noUnusedLocals: false,
            inlineSourceMap: false
          }
        }
      }),
      replace({
        'server/sentimentanalysis': 'js/sentimentanalysis',
        include: ['src/text-sentiment-classifier.ts']
      }),
      jsonPlugin,
      node(),
    ],
    external: builtins
  },
  {
    input: 'src/text-sentiment-classifier.ts',
    output:[
      {
        name: 'textSentimentClassifier',
        file: 'dist/src/max.sentimentclass.cjs.js',
        format: 'cjs',
        sourcemap: true
      },
    ],
    plugins: [
      typescript({
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: 'ES2015',
            noUnusedLocals: false,
            inlineSourceMap: false
          }
        }
      }),
      jsonPlugin,
      node()
    ],
    external: builtins
  }
]
