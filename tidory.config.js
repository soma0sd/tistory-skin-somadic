/**
 * Tidory Configuration
 * https://tidory.com/docs/configuration/
 */
module.exports = {
  ts_session: 'none',
  url: 'none',

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
    mode: 'entry'
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