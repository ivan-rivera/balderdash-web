// import { describe, it, expect, vi } from 'vitest';
// import { kick } from '$lib/game/global';
// import { parseSessionRequest } from '../../../src/lib/game/helpers';
// import { get } from 'svelte/store';

// vi.mock('../../../src/lib/game/helpers', async () => {
// 	return {
// 		parseSessionRequest: vi.fn(),
// 	};
// });

// describe('kick', () => {
// 	it('should remove a player from the scoreboard and add them to the kick register', async () => {
// 		const mockCookies = {
// 			get: vi.fn((name) => {
// 				if (name === 'USERNAME') return 'P1';
// 				else if (name === 'SESSION_ID') return 'ABCD123';
// 				return '';
// 			}),
// 		};
// 		const mockParams = { sessionId: 'ABCD123' };
// 		const mockRequest = {
// 			formData: vi.fn().mockResolvedValue({
// 				// @ts-ignore
// 				get: (name) => {
// 					if (name === 'kicked') return 'P2';
// 					else if (name === 'kicker') return 'P1';
// 					return '';
// 				},
// 			}),
// 		};
// 		const mockForm = await mockRequest.formData();
// 		const updateSpy = vi.fn();
// 		parseSessionRequest.mockResolvedValue({
// 			form: mockForm,
// 			sm: { roundRef: { update: updateSpy } },
// 		});
// 		await kick(mockCookies, mockParams, mockRequest);
// 		expect(updateSpy).toHaveBeenCalledWith({});
// 	});
// });
