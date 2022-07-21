## Register provider

Start by registering the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-cast-attributes/providers/CastAttributesProvider'
]
```

## Using the module:

Add trait and casts to the model:
```js
class User {
  static boot () {
    super.boot()
    
      // Add the trait and casts to a model
    this.addTrait('@provider:CastAttributes')
  }
  
  // add values to cast to upon set
  static get casts () {
    return {
      company_id: 'int',
      name: 'string',
      interests: 'array',
      another: 'string',
    }
  }
}
```

See [README.md](README.md) for more info about casting options.
