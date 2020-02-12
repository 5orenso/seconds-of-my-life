/* eslint-env node, jest */

import { h } from 'preact';
import render from 'preact-render-to-string';
import Progress from '../../../src/components/progress';

describe('components/progress', () => {
    it('should render Progress', () => {
        const msg = '<div class=\"progress\"';
        const result = render(<Progress />);
        expect(result).toMatch(new RegExp(msg));
    })
});
