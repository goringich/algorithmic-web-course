import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import strip from '@rollup/plugin-strip';

export default {
  input: 'src/pages/algorithmsPage/components/ContentDisplay.tsx',
  output: {
    file: 'src/pages/algorithmsPage/components/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    babel({ babelHelpers: 'bundled', extensions: ['.ts', '.tsx', '.js', '.jsx'] }),

    // Удаляем "use client" из @mui, но не из src/
    strip({
      include: ['node_modules/@mui/**'], // Удаляем директиву только из node_modules
      functions: ['use client'],
    }),
  ],
  external: ['react', 'react-dom', '@mui/material'], // Исключаем React и MUI из бандла
};
