/* eslint-env node, jest */

import { h } from 'preact';
import render from 'preact-render-to-string';
import Status from '../../../src/components/status';

describe('components/status', () => {
    it('should render Status', () => {
        const msg = 'We have coffe :D';
        const result = render(<Status message={msg} />);
        expect(result).toMatch(new RegExp(msg));
    })
});
