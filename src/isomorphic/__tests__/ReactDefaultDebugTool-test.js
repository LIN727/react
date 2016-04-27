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

describe('ReactDefaultDebugTool', function() {
  var ReactDefaultDebugTool;

  beforeEach(function() {
    jest.resetModuleRegistry();
    ReactDefaultDebugTool = require('ReactDefaultDebugTool');
  });

  it('should add and remove devtools', () => {
    var handler1 = jasmine.createSpy('spy');
    var handler2 = jasmine.createSpy('spy');
    var devtool1 = {onTestEvent: handler1};
    var devtool2 = {onTestEvent: handler2};

    ReactDefaultDebugTool.addDevtool(devtool1);
    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(1);
    expect(handler2.calls.length).toBe(0);

    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(2);
    expect(handler2.calls.length).toBe(0);

    ReactDefaultDebugTool.addDevtool(devtool2);
    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(3);
    expect(handler2.calls.length).toBe(1);

    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(4);
    expect(handler2.calls.length).toBe(2);

    ReactDefaultDebugTool.removeDevtool(devtool1);
    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(4);
    expect(handler2.calls.length).toBe(3);

    ReactDefaultDebugTool.removeDevtool(devtool2);
    ReactDefaultDebugTool.onTestEvent();
    expect(handler1.calls.length).toBe(4);
    expect(handler2.calls.length).toBe(3);
  });

  it('warns once when an error is thrown in devtool', () => {
    spyOn(console, 'error');
    ReactDefaultDebugTool.addDevtool({
      onTestEvent() {
        throw new Error('Hi.');
      },
    });

    ReactDefaultDebugTool.onTestEvent();
    expect(console.error.calls.length).toBe(1);
    expect(console.error.argsForCall[0][0]).toContain(
      'exception thrown by devtool while handling ' +
      'onTestEvent: Hi.'
    );

    ReactDefaultDebugTool.onTestEvent();
    expect(console.error.calls.length).toBe(1);
  });
});
