/**
 * @typedef {import("$lib/types").Ref} Ref
 */

import { vi } from 'vitest';
import { GUESSES, REFS, SESSION_ID, UID, USERNAME } from '$lib/constants.js';
import { dummySessionManager, SESSION_ID as sessionId } from './data.js';
import { parseSessionRequest } from '$lib/game/helpers.js';
import { contactRef } from '$lib/firebase/server.js';

export function createParseSessionRequestMock() {
	vi.mock('$lib/game/helpers', async () => {
		return {
			generateAiGuesses: () => ({ [`${GUESSES}/NPC-1`]: 'NPC 1' }),
			parseSessionRequest: vi.fn(),
		};
	});
	vi.mock('$lib/analytics', () => {
		return {
			client: {
				capture: vi.fn(),
			},
		};
	});
}

export function createMockCookies(mapping) {
	return {
		get: vi.fn((name) => mapping[name] || ''),
	};
}

export function createMockRequest(formDataMapping) {
	return {
		formData: vi.fn().mockResolvedValue({
			get: (name) => formDataMapping[name] || '',
			entries: function* () {
				for (let key in formDataMapping) {
					yield [key, formDataMapping[key]];
				}
			},
		}),
	};
}

/**
 * Mock a session request
 * @param {string} username - username of the player triggering the action
 * @param {Object.<string, any>} request - request object
 * @param {Ref} ref - either session or round reference call to mock
 */
export async function setupMocks(username, request, ref) {
	const mockCookies = createMockCookies({
		[USERNAME]: username,
		[UID]: UID,
		[SESSION_ID]: sessionId,
	});
	const mockRequest = createMockRequest(request);
	const mockParams = { sessionId };
	const mockForm = await mockRequest.formData();
	let mockUpdate;
	if (ref === REFS.SESSION) {
		mockUpdate = dummySessionManager.sessionRef.update = vi.fn();
	} else if (ref === REFS.ROUND) {
		const mockChild = { update: vi.fn() };
		dummySessionManager.sessionRef.child = vi.fn().mockReturnValue(mockChild);
		mockUpdate = mockChild.update;
	} else if (ref === REFS.FEEDBACK) {
		const mockChild = { update: vi.fn() };
		contactRef.child = vi.fn().mockReturnValue(mockChild);
		mockUpdate = mockChild.update;
	} else if (ref === REFS.ENQUIRIES) {
		const mockChild = { update: vi.fn() };
		contactRef.child = vi.fn().mockReturnValue(mockChild);
		mockUpdate = mockChild.update;
	}
	parseSessionRequest.mockResolvedValue({ form: mockForm, sm: dummySessionManager });
	return { mockCookies, mockRequest, mockParams, mockUpdate };
}
