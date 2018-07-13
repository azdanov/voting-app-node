module.exports = {
  content: ['./views/**/*.pug', './public/**/*.js'],
  css: ['./public/styles.css'],
  whitelist: ['body', 'html'],
  extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-z0-9-:\/]+/g)
        }
      },
      extensions: ['pug', 'js'],
    },
  ],
}
