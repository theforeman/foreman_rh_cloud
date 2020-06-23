import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';
import DocsButton from '../DocsButton';

global.URL_PREFIX = '';

const fixtures = {
  'render without Props': {},
};

describe('DocsButton', () => {
  describe('rendering', () =>
    testComponentSnapshotsWithFixtures(DocsButton, fixtures));
});
