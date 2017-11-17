# adonis-cast-attributes
Attributes sent to the server should be checked. This module allows you to cast data to its expected form before processing.

## How to use

Install npm module:

```bash
$ adonis install adonis-cast-attributes
```

## Register provider

Once you have installed adonis-cast-attributes, make sure to register the provider inside `start/app.js` in order to make use of it.

```js
const providers = [
  'adonis-cast-attributes/providers/CastAttributesProvider'
]
```

## Using the module:

Add trait and casts to the model:
```js
class User {
  static super () {
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

Add data to model from route:
```js
const User = use('App/Models/User')

Route.post('/register', ({request}) => {
  const model = new User()
  model.fill({
    company_id: "321",
    interests: ['item1','item2','item3'],
    name: 'Simon',
    another: ['1','blah','2']
  })
  
  console.log(model)
  /*
    output:
    { company_id: 321,
      interests: [ 'item1', 'item2', 'item3' ],
      name: "Simon"
      another: "1,blah,2" }
    */
})
```
Now whatever gets posted from the client will abide by the cast rules. 
So `company_id` will be coerced to an interger, `name` to a string (meaning if an array or some other invalid data was
passed it will convert) and `interests` to an array.


## Nested casting
You can also pass in the 'shape' a nested object you wish to cast like so:

```js
  // ... inside model class ...
  static get casts () {
    return {
      company_id: 'int',
      name: 'string',
      profile: {
        nickname: 'string',
        birthdate: 'date',
        age: 'int'
      }
    }
  }
```

Now when an tabulated data is sent such as `profile[nickname]=simon&profile[birthdate]=1983-11-10&age=123` it will 
cast the nested data accordingly.

You can also pass in arrays:

```js
  // ... inside model class ...
  static get casts () {
    return {
      company_id: 'int',
      name: 'string',
      properties: [{
        key: 'string',
        value: 'json',
      }]
    }
  }
```
Regardless of how many array values you post for `properties` it will abide by the first casted rule in the `casts.properties` array.

## Casting options

The following cast types are available: 
- `int`,`integer`,`real`,`float`,`double` - Numbers
- `string` - String
- `bool`,`boolean` - Boolean
- `object`,`json` - JSON
- `array` - Array
- `date`,`datetime` - Moment date object
- `timestamp` - Unix timestamp

## Manual attribute casting

You can use the `AttributeCaster` provider to manually cast data like so:
```js
  const AttributeCaster = use('AttributeCaster')

  const values = {
    name: 'Simon',
    id: '321',
    interests: ['coding', 'sports', 'reading'],
    properties: [
      {key: 'color', value: 'red'},
      {key: 'last_ip', value: '123.123.123.123'},
      {key: 'last_login', value: [1,2,3]}
    ],
    another: '123',
    another2: 'testing',
  }
```
and then cast the values:
```js
  const casts = {
    id: 'int',
    interests: 'array',
    properties: [{
      key: 'string',
      value: 'string'
    }]
  }
  
  console.log(AttributeCaster.castAttributes(casts, values))
  /*
  output:
  { name: 'Simon',
    id: 321,
    interests: [ 'coding', 'sports', 'reading' ],
    properties: 
     [ { key: 'color', value: 'red' },
       { key: 'last_ip', value: '123.123.123.123' },
       { key: 'last_login', value: '1,2,3' } ],
    another: '123',
    another2: 'testing' }
  */
```

or you can ignore values that don't have a cast type set:
```js
  const casts = {
    id: 'int',
    interests: 'array',
    properties: [{
      key: 'string',
      value: 'string'
    }]
  }
  
  console.log(AttributeCaster.castAttributes(casts, values, true))
  /*
  output:
  { id: 321,
    interests: [ 'coding', 'sports', 'reading' ],
    properties: 
     [ { key: 'color', value: 'red' },
       { key: 'last_ip', value: '123.123.123.123' },
       { key: 'last_login', value: '1,2,3' } ] }
  */
```

or fill in missing casts when value wasn't passed:
```js
  const casts = {
    team_id: 'int',
    registered_date: 'datetime',
    last_name: 'string',
    id: 'int',
    interests: 'array',
    properties: [{
      key: 'string',
      value: 'string'
    }]
  }
  
  console.log(AttributeCaster.castAttributes(casts, values, false, false))
  /*
  output:
  { team_id: 0,
    registered_date: null,
    last_name: '',
    id: 321,
    interests: [ 'coding', 'sports', 'reading' ],
    properties: 
     [ { key: 'color', value: 'red' },
       { key: 'last_ip', value: '123.123.123.123' },
       { key: 'last_login', value: '1,2,3' } ],
    name: 'Simon',
    another: '123',
    another2: 'testing' }
  */
```

## Built With

* [AdonisJS](http://adonisjs.com) - The web framework used.

## Versioning

[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/simontong/adonis-cast-attributes/tags).  

## Authors

* **Simon Tong** - *Developer* - [simontong](https://github.com/simontong)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Changelog

- v1.0.0
  - Initial release.
  