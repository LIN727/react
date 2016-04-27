/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
 */

'use strict';

describe('ReactInvalidSetStateWarningDevtool', () => {
  var React;
  var ReactDOM;

  var oldProcess;

  beforeEach(() => {
    oldProcess = global.process;
    global.process = {env: {NODE_ENV: 'development'}};
    jest.resetModuleRegistry();

    React = require('React');
    ReactDOM = require('ReactDOM');
  });

  afterEach(() => {
    global.process = oldProcess;
    jest.resetModuleRegistry();
  });

  it('should warn about `setState` in getChildContext', function() {
    spyOn(console, 'error');

    var container = document.createElement('div');

    var renderPasses = 0;

    var Component = React.createClass({
      getInitialState: function() {
        return {value: 0};
      },
      getChildContext: function() {
        if (this.state.value === 0) {
          this.setState({ value: 1 });
        }
      },
      render: function() {
        renderPasses++;
        return <div />;
      },
    });
    expect(console.error.calls.length).toBe(0);
    var instance = ReactDOM.render(<Component />, container);
    expect(renderPasses).toBe(2);
    expect(instance.state.value).toBe(1);
    expect(console.error.calls.length).toBe(1);
    expect(console.error.argsForCall[0][0]).toBe(
      'Warning: setState(...): Cannot call setState() inside getChildContext()'
    );
  });
});
