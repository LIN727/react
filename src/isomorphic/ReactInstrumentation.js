/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactInstrumentation
 */

'use strict';

var ReactDebugTool = null;
var __TEST__ = process.env.NODE_ENV === 'test';

if (__DEV__ && !__TEST__) {
  // It is disabled in production and in tests.
  // Disabling it in tests lets us be more confident
  // that no code paths accidentally rely on its existence.
  // Tests for devtools themselves need to shim
  // process.env.NODE_ENV to be "development".
  ReactDebugTool = require('ReactDefaultDebugTool');
}

module.exports = {debugTool: ReactDebugTool};
