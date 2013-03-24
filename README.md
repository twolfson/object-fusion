# object-fusion

Combine outline and content into an object

## Getting Started
Install the module with: `npm install object-fusion`

```javascript
// Load in objectFusion
var objectFusion = require('object-fusion');

// Create an outline and content to fuse
var outline = {
  'One': {
    'is equal to one': true
  }
};

var content = {
  'One': function () {
    this.one = 1;
  },
  'is equal to one': function () {
    assert.strictEqual(this.one, 1);
  }
};

// Fuse them together
var fusedObject = objectFusion({
      outline: outline,
      content: content
    });

// The result looks like
{
  'One': {
    'value': function () {
      this.one = 1;
    },
    'child': {
      'is equal to one': {
        'value': function () {
          assert.strictEqual(this.one, 1);
        }
      }
    }
  }
}
```

## Documentation
`objectFusion` exposes a single function for you to use.

```js
objectFusion(params);
/**
 * Fuse outline and content objects together
 * @param {Object} params Container for parameters
 * @param {Object} params.outline Object containing strings or nested objects of similar format
 * @param {Object} params.content Key/value pairs that correspond to those in params.outline
 * @param {Function} [params['value proxy']] Optional proxy for `value` once looked up
 * @param {Function} [params['child proxy']] Optional proxy for `child` once looked up
 * @returns {Object} Combined object fused by params.outline values to params.content keys
 */
```

There is the `Fuser`, available as `objectFusion.Fuser`, which does the heavy lifting. If you provide a proxy, it will be invoked in a `Fuser` context.

```js
Fuser() - Constructor for fusing mechanism
Fuser.set(name, val) - Bind settings to instance (e.g. fuser.set('value proxy', fn);)
Fuser.get(name) - Retrieve settings from instance (e.g. fuser.get('value proxy');)
Fuser.addValue(name, val) - Add value for translation
Fuser.addValues(valueObj) - Add object of values for translation
Fuser.getValue(name) - Look up (and proxy) value by name (uses those stored via Fuser.addValue/addValues)
Fuser.getChild(obj, name) - Look up (and proxy) child from obj by name
Fuser.translate(obj) - Walk obj (depth-first), looking up value and child of each node
```

Lastly, there are proxies available which allow for key aliasing and array expansion.

- `objectFusion.aliasProxy` - Allows for aliasing of content values (e.g. `{'uno': 'one'}`)
- `objectFusion.expandProxy` - Allows for expansion of content values (e.g. `{'two': ['one', 'plusOne']}`
- `objectFusion.aliasAndExpandProxy` - Allows for both aliasing and expansion of content values

## Examples
[Getting started][getting-started] demonstrated basic usability. Here is an advanced case using aliasing and expansion.

TODO: Example of aliasAndExpandProxy in action

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
