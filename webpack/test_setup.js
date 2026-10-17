import 'foremanJSTestSetup';

/* eslint-disable global-require, react/prop-types */
jest.mock(
  '@patternfly/react-core/deprecated',
  () => {
    const React = require('react');

    return {
      Dropdown: ({ children }) => React.createElement('div', null, children),
      DropdownItem: ({ children, ...props }) =>
        React.createElement('div', props, children),
      KebabToggle: props =>
        React.createElement('button', { type: 'button', ...props }),
    };
  },
  { virtual: true }
);
/* eslint-enable global-require, react/prop-types */
