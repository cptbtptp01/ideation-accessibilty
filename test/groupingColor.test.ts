import { groupByColors } from '../src/grouping.tsx';

jest.mock('miro', () => {
    return {
        board: {
        get: jest.fn().mockResolvedValue(mockItems1),
        },
    };
});
