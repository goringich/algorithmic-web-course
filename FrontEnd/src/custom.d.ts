// Поддержка SCSS-модулей
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

// Поддержка PNG
declare module '*.png' {
  const value: string;
  export default value;
}

// Поддержка SVG
declare module '*.svg' {
  const value: string;
  export default value;
}
