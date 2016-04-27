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

describe('ReactInstrumentation', () => {
  var oldProcess;

  beforeEach(() => {
    jest.resetModuleRegistry();
    oldProcess = global.process;
  });

  afterEach(() => {
    global.process = oldProcess;
    __DEV__ = true;
  });

  it('provides ReactDefaultDebugTool in development', () => {
    global.process = {env: {NODE_ENV: 'development'}};
    jest.resetModuleRegistry();

    var {debugTool} = require('ReactInstrumentation');
    expect(debugTool).toBe(require('ReactDefaultDebugTool'));
  });

  it('provides no debugTool in production', () => {
    __DEV__ = false;
    global.process = {env: {NODE_ENV: 'production'}};
    jest.resetModuleRegistry();

    var {debugTool} = require('ReactInstrumentation');
    expect(debugTool).toBe(null);
  });
});
