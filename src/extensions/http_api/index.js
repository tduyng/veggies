'use strict'

/**
 * @module extensions/httpApi
 */

import * as definitions from './definitions.js'
import extendWorld from './extend_world.js'

/**
 * Extends cucumber world object.
 * Must be used inside customWorldConstructor.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 *
 * @function
 * @param {Object} world - The cucumber world object
 */
export { extendWorld }

/**
 * The http API configuration object.
 *
 * @typedef {Object} HttpApiConfig
 * @property {string} [baseUrl=''] - The base url used for all http calls
 */

/**
 * Installs the extension.
 *
 * @example
 * // /support/world.js
 *
 * const { setWorldConstructor } = require('@cucumber/cucumber')
 * const { state, httpApi } = require('@ekino/veggies')
 *
 * setWorldConstructor(function() {
 *     state.extendWorld(this) // httpApi extension requires state extension
 *     httpApi.extendWorld(this)
 * })
 *
 * state.install()
 * httpApi.install({ baseUrl: 'http://localhost:3000' })
 *
 * @param {HttpApiConfig} config - Http global conf
 */
export const install = ({ baseUrl = '' } = {}) => {
    definitions.install({ baseUrl })
}
