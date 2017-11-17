'use strict'

const _ = require('lodash')
const moment = require('moment')

class AttributeCaster {
  /**
   * Cast multiple attributes
   *
   * @param casts
   * @param values
   * @param omitValuesWithNoCasts leave out values that don't have any matching casts
   * @param omitCastsWithNoValues if true then will include default cast types where values are empty
   * @returns {*}
   */
  castAttributes (casts, values, omitValuesWithNoCasts = false, omitCastsWithNoValues = true) {
    if (!_.size(values) || !_.size(casts)) {
      return null
    }

    // include empty casts if requested
    if (!omitCastsWithNoValues) {
      const castDefaults = _.mapValues(casts, cast => this.castAttributeTo(cast, null))
      values = _.assign(castDefaults, values)
    }

    // is passed values array (for nested casts) or object
    const initial = _.isArray(casts) ? [] : {}

    return _.reduce(values, (o, value, key) => {
      // cast to (cast[0] means first casting array of nested)
      const castTo = casts && (casts[key] || casts[0])

      // if value passed is undefined or omitting values then skip
      if (value === undefined || (!castTo && omitValuesWithNoCasts)) {
        return o
      }

      // cast casted value (could be nested or primitive value)
      let casted
      if (_.isObject(castTo)) {
        // if object then recurse into object
        casted = this.castAttributes(castTo, value, omitValuesWithNoCasts, omitCastsWithNoValues)
      } else {
        // cast our value
        casted = this.castAttributeTo(castTo, value)
      }

      // add to object/array
      if (_.isArray(o)) {
        o.push(casted)
      } else {
        o[key] = casted
      }

      return o
    }, initial)
  }

  /**
   * Cast an attribute to its correct type
   *
   * @param cast
   * @param value
   * @returns {*}
   */
  castAttributeTo (cast, value) {
    switch (cast) {
      case 'int':
      case 'integer':
        return _.toInteger(value)

      case 'real':
      case 'float':
      case 'double':
        return _.toNumber(value)

      case 'string':
        return _.toString(value)

      case 'bool':
      case 'boolean':
        return Boolean(value)

      case 'array':
      case 'json':
      case 'object':
        try {
          if (_.isObjectLike(value)) {
            value = JSON.stringify(value)
          }
          return JSON.parse(value)
        } catch (e) {
          return null
        }

      case 'date':
        return value ? moment(value).format('YYYY-MM-DD') : null

      case 'datetime':
        return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null

      case 'timestamp':
        return value ? moment(value).unix() : null

      default:
        return value
    }
  }

  /**
   * Cast attribute from its original form.
   * should be stored in a format that can be
   * saved to DB (date->string, json->stringify etc.)
   *
   * @param cast
   * @param value
   */
  castAttributeFrom (cast, value) {
    if (value === null) {
      return null
    }

    // if object/array then convert to json
    if (cast === 'json' || _.isObjectLike(value)) {
      return JSON.stringify(value)
    }

    return value
  }
}

module.exports = AttributeCaster
