/* eslint-env node, jest */

import { h } from 'preact';
import render from 'preact-render-to-string';
import Frontpage from '../../../src/components/frontpage';

describe('components/status', () => {
    it('should render Status', () => {
        const msg = 'Hello world';
        const result = render(<Frontpage />);
        expect(result).toMatch(new RegExp(msg));
    })
});
