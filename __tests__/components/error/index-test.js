/* eslint-env node, jest */

import { h } from 'preact';
import render from 'preact-render-to-string';
import Error from '../../../src/components/error';

describe('components/error', () => {
    it('should render Error', () => {
        const errorMsg = 'We are out of coffee!!!';
        const result = render(<Error message={errorMsg} />);
        expect(result).toMatch(new RegExp(errorMsg));
    })
});
