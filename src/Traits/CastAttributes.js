'use strict'

const _ = require('lodash')
const util = require('@adonisjs/lucid/lib/util')
const AttributeCaster = use('AttributeCaster')

class CastAttributes {
  register (Model) {
    this.addGettersAndSetters(Model)
  }

  /**
   * Add getters and setters to model for each casted attribute
   *
   * @param Model
   */
  addGettersAndSetters (Model) {
    _.each(Model.casts, (cast, key) => {
      // add getter
      const getter = util.getGetterName(key)
      if (typeof Model.prototype[getter] !== 'function') {
        Model.prototype[getter] = this.getter(cast)
      }

      // add setter
      const setter = util.getSetterName(key)
      if (typeof Model.prototype[setter] !== 'function') {
        Model.prototype[setter] = this.setter(cast)
      }
    })
  }

  /**
   * Getter method
   *
   * @param cast
   * @returns {*}
   */
  getter (cast) {
    return (value) => {
      return AttributeCaster.castAttributeTo(cast, value)
    }
  }

  /**
   * Setter method
   *
   * @param cast
   * @returns {*}
   */
  setter (cast) {
    return (value) => {
      return AttributeCaster.castAttributeFrom(cast, value)
    }
  }
}

module.exports = CastAttributes
