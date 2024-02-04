import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import * as navigation from '$app/navigation';
import Main from '../../src/routes/+page.svelte';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

describe('Main page', () => {
    const { getByText } = render(Main);
    it('should render Balderdash text', () => {
        expect(getByText('Balderdash • /ˈbɔːldədaʃ/')).toBeTruthy();
    });
    it('should contain the button "Start Game" which navigates to /new', () => {
        fireEvent.click(getByText('Start Game'));
        expect(vi.mocked(navigation.goto)).toHaveBeenCalledWith('/new');
    });
    it('should contain the button "Join Game" which navigates to /join', () => {
        fireEvent.click(getByText('Join Game'));
        expect(vi.mocked(navigation.goto)).toHaveBeenCalledWith('/join');
    })
})
