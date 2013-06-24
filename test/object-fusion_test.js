// Load in our library and dependencies
var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert'),
    glob = require('glob');

// Find all input/output files
var inputFiles = glob.sync('*.input.*', {cwd: __dirname});

// Iterate over them
describe('object-fusion', function () {
  // Create an `it` method for each input
  inputFiles.forEach(function beginTest (inputFile) {
    // Begin the test
    it('interpretting "' + inputFile + '" matches expected output', function testFn () {
      // Load in the input and output files
      var outputFile = inputFile.replace('input', 'output'),
          input = require('./' + inputFile),
          expectedOutput = require('./' + outputFile);

      // If there is a value proxy, swap it out
      var valueProxy = input['value proxy'];
      if (valueProxy) {
        if (valueProxy === 'alias') {
          input['value proxy'] = objectFusion.aliasProxy;
        } else if (valueProxy === 'expand') {
          input['value proxy'] = objectFusion.expandProxy;
        }
      }

      // Process the input via object-fusion
      var actualOutput = objectFusion(input);

      // Compare it to the output
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });
});

// Kitchen sink
describe('An reverse alphabetical outline', function () {
  before(function () {
    // Write out a reserve alphabetical outline
    this.outline = {
      'z': true,
      'a': true
    };
    this.content = {};
  });

  describe('when fused', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content
      });
    });

    it('preserves order', function () {
      // Pluck the keys in order from the fusedObject
      var fusedObject = this.fusedObject,
          keys = [],
          key;
      for (key in fusedObject) {
        if (fusedObject.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      // Assert the keys are still in reverse order
      assert.deepEqual(keys, ['z', 'a']);
    });
  });
});