module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    ['prismjs', {
      'languages': ['javascript', 'java', 'css', 'html', 'markup'],
      'plugins': ['line-numbers', 'show-language', 'normalize-whitespace'],
      'theme': 'tomorrow',
      'css': true
    }]
  ]
}
