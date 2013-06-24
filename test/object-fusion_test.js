// Load in our library and dependencies
var objectFusion = require('../lib/object-fusion.js'),
    glob = require('glob'),
    test = require('tape');

// Find all input/output files
var inputFiles = glob.sync('*.input.*', {cwd: __dirname});

// Iterate over them
inputFiles.forEach(function beginTest (inputFile) {
  // Begin the test
  test('Testing object-fusion on "' + inputFile + '"', function testFn (t) {
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
    t.deepEqual(actualOutput, expectedOutput);

    // End the test
    t.end();
  });
});