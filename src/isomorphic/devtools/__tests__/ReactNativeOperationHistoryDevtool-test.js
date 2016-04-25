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

describe('ReactNativeOperationHistoryDevtool', () => {
  var React;
  var ReactDebugTool;
  var ReactDOM;
  var ReactDOMComponentTree;
  var ReactDOMFeatureFlags;
  var ReactNativeOperationHistoryDevtool;

  beforeEach(() => {
    jest.resetModuleRegistry();

    React = require('React');
    ReactDebugTool = require('ReactDebugTool');
    ReactDOM = require('ReactDOM');
    ReactDOMComponentTree = require('ReactDOMComponentTree');
    ReactDOMFeatureFlags = require('ReactDOMFeatureFlags');
    ReactNativeOperationHistoryDevtool = require('ReactNativeOperationHistoryDevtool');

    ReactDebugTool.addDevtool(ReactNativeOperationHistoryDevtool);
  });

  afterEach(() => {
    ReactDebugTool.removeDevtool(ReactNativeOperationHistoryDevtool);
  });

  function assertHistoryMatches(type, expectedHistoryForType) {
    var actualHistoryForType = ReactNativeOperationHistoryDevtool.getHistory()
      .filter(entry => entry.type === type);
    expect(actualHistoryForType).toEqual(expectedHistoryForType);
  }

  describe('mounting into container', () => {
    it('gets recorded for native roots', () => {
      var node = document.createElement('div');
      ReactDOM.render(<div><p>Hi.</p></div>, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);

      assertHistoryMatches('mount', [{
        instanceID: inst._debugID,
        type: 'mount',
        payload: ReactDOMFeatureFlags.useCreateElement ?
          'DIV' :
          '<div data-reactroot="" data-reactid="1"><p data-reactid="2">Hi.</p></div>',
      }]);
    });

    it('gets recorded for composite roots', () => {
      function Foo() {
        return <div><p>Hi.</p></div>;
      }
      var node = document.createElement('div');
      ReactDOM.render(<Foo />, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);
      assertHistoryMatches('mount', [{
        instanceID: inst._debugID,
        type: 'mount',
        payload: ReactDOMFeatureFlags.useCreateElement ?
          'DIV' :
          '<div data-reactroot="" data-reactid="1"><p data-reactid="2">Hi.</p></div>',
      }]);
    });

    it('gets recorded for composite roots that return null', () => {
      function Foo() {
        return null;
      }
      var node = document.createElement('div');
      ReactDOM.render(<Foo />, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);
      assertHistoryMatches('mount', [{
        instanceID: inst._debugID,
        type: 'mount',
        payload: ReactDOMFeatureFlags.useCreateElement ?
          '#comment' :
          '<!-- react-empty: 1 -->',
      }]);
    });
  });

  describe('updating styles', () => {
    it('gets recorded during mount', () => {
      var node = document.createElement('div');
      ReactDOM.render(<div style={{ color: 'red' }} />, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);

      if (!ReactDOMFeatureFlags.useCreateElement) {
        assertHistoryMatches('update styles', []);
        return;
      }

      assertHistoryMatches('update styles', [{
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { color: 'red' },
      }]);
    });

    it('gets recorded during an update', () => {
      var node = document.createElement('div');
      ReactDOM.render(<div />, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);

      ReactDOM.render(<div style={{ color: 'red' }} />, node);
      ReactDOM.render(<div style={{ color: 'blue', backgroundColor: 'yellow' }} />, node);
      ReactDOM.render(<div style={{ backgroundColor: 'green' }} />, node);
      ReactDOM.render(<div />, node);

      assertHistoryMatches('update styles', [{
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { color: 'red' },
      }, {
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { color: 'blue', backgroundColor: 'yellow' },
      }, {
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { color: '', backgroundColor: 'green' },
      }, {
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { backgroundColor: '' },
      }]);
    });

    it('does not get recorded if the styles are shallowly equal', () => {
      var node = document.createElement('div');
      ReactDOM.render(<div />, node);
      var inst = ReactDOMComponentTree.getInstanceFromNode(node.firstChild);

      ReactDOM.render(<div style={{ color: 'red' }} />, node);
      ReactDOM.render(<div style={{ color: 'red' }} />, node);

      assertHistoryMatches('update styles', [{
        instanceID: inst._debugID,
        type: 'update styles',
        payload: { color: 'red' },
      }]);
    });
  });
});
