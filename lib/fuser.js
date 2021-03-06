var EventEmitter = require('events').EventEmitter;

function Fuser() {
  // Create storage for values
  this.values = {};

  // Inherit from event emitter
  EventEmitter.call(this);
}
var FuserProto = {
  // Bind settings directly to this (express style)
  set: function (name, val) {
    this[name] = val;
  },
  get: function (name) {
    return this[name];
  },

  // Save values for translation
  addValue: function (name, val) {
    this.values[name] = val;
  },
  // Helper for batch adding of values
  addValues: function (valObj) {
    // Iterate over the properties and add each
    var names = Object.getOwnPropertyNames(valObj),
        that = this;
    names.forEach(function addValFn (name) {
      that.addValue(name, valObj[name]);
    });
  },
  // Helper to get values
  getValue: function (name) {
    var val = this.values[name];

    // Expose value key
    this.set('value key', name);

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('value proxy');
    if (proxy) {
      val = proxy.call(this, val);
    }

    // Emit that a key was used
    this.emit('value key used', name);

    // If the value is not defined, emit a key not found
    if (!val) {
      this.emit('value key not found', name);
    }

    // Unset value key
    this.set('value key', null);

    return val;
  },
  // Layer between direct accessing of children
  getChild: function (obj, name) {
    var child = obj[name];

    // Expose child name
    this.set('child key', name);

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('child proxy');
    if (proxy) {
      child = proxy.call(this, child);
    }

    // Emit that a key was used
    this.emit('child key used', name);

    // If the child is not defined, emit a key not found
    if (!child) {
      this.emit('child key not found', name);
    }

    // Unset child key
    this.set('child key', null);

    return child;
  },
  // Translate object via saved properties
  translate: function (obj) {
    // Iterate over the object (via for in to preserve ordering)
    var key,
        retObj = {};
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Create a node for this index
        var node = {};

        // Expose node
        this.set('node', node);

        // Lookup the value of the node and save it (if possible)
        var value = this.getValue(key);
        if (value !== undefined) {
          node.value = value;
        }

        // Grab the child and iterate it (if possible)
        var child = this.getChild(obj, key);
        if (typeof child === 'object') {
          node.child = this.translate(child);
        }

        // Save node to retObj
        retObj[key] = node;

        // Unset node
        this.set('node', null);
      }
    }

    // Return the retObj
    return retObj;
  }
};
Fuser.prototype = FuserProto;

// Duck punch inheritance from EventEmitter
var EventProto = EventEmitter.prototype,
    EventProtoKeys = Object.getOwnPropertyNames(EventProto);
EventProtoKeys.forEach(function (key) {
  FuserProto[key] = EventProto[key];
});

// Export Fuser
module.exports = Fuser;