'use strict'

const {ServiceProvider} = require('@adonisjs/fold')

class CastAttributesProvider extends ServiceProvider {
  register () {
    // attribute caster
    this.app.singleton('AttributeCaster', () => {
      const AttributeCaster = require('../src/AttributeCaster')
      return new AttributeCaster()
    })

    // cast attributes trait
    this.app.singleton('Adonis/Traits/CastAttributes', () => {
      const CastAttributes = require('../src/Traits/CastAttributes')
      return new CastAttributes()
    })
    this.app.alias('Adonis/Traits/CastAttributes', 'CastAttributes')
  }
}

module.exports = CastAttributesProvider
