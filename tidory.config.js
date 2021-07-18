/**
 * Tidory Configuration
 * https://tidory.com/docs/configuration/
 */
module.exports = {
  ts_session: 'ba6f110ff0b879ac932391f5e37fef2e854b7371',
  url: 'https://soma0sd-blog.tistory.com/',

  /** Preview */
  preview: {
    /** homeType:
     * NONE
     * COVER
     */
    homeType: 'NONE',

    /** Preview Mode:
    * index
    * entry
    * category
    * tag
    * location
    * media
    * guestbook
    */
    mode: 'index'
  },

  /**
  * Webpack Configuration
  *
  * @param {object} webpackConfig
  */
  extends (webpackConfig) {
    webpackConfig.module.rules = [
      {
        enforce: 'pre',
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      ...webpackConfig.module.rules
    ]
  }
}