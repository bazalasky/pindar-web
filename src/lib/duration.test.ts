import { describe, it, expect } from 'vitest'
import { toSeconds, formatDuration } from './duration'

describe('toSeconds', () => {
    it.each([
        [1, 0, 0, 3600],
        [0, 1, 0, 60],
        [0, 0, 1, 1],
        [1, 1, 1, 3661],
        [0, 0, 0, null],
        [NaN, 0, 0, null],
    ])('converts %i hours, %i minutes, and %i seconds to total seconds', (hours, minutes, seconds, expected) => {
        expect(toSeconds(hours, minutes, seconds)).toBe(expected)
    })
})

describe('formatDuration', () => {
    it.each([
        [3600, '01:00:00'],
        [60, '00:01:00'],
        [1, '00:00:01'],
        [3661, '01:01:01'],
        [0, '00:00:00'],
    ])('formats %i seconds into %s', (seconds, expected) => {
        expect(formatDuration(seconds)).toBe(expected)
    })
})