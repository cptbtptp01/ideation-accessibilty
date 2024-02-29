import { getColor, getStickyNoteColor } from '../src/grouping';
import { mockShape1, mockShape2, mockShape3 } from './mockBoardNodes';
import { mockStickyNote1, mockStickyNote2 } from './mockBoardNodes';

// test groupByColor function
// given we are declaring global variables in the actual code,
// solution for testing is to mock the function logic within the test file
function groupByColor(cluster: Set<string>, items: any) {
    let colorMap: Map<string, Set<string>> = new Map();
    cluster.forEach((item) => {
        const color = getColor(item, items);
        if (colorMap.has(color)) {
            colorMap.get(color)!.add(item);
        } else {
            colorMap.set(color, new Set([item]));
        }
        return colorMap;
    });
    return colorMap;
}

// Map(4) {
//     'Lightning Yellow' => Set(2) { '3458764580516886289', '3458764580530425719' },
//     'Uncolored' => Set(1) { '3458764580530425796' },
//     'Light Yellow' => Set(1) { '3458764580516885999' },
//     'Yellow' => Set(1) { '3458764580516886689' }
//   }
describe('groupByColor', () => {
    it('should group items by color', () => {
        const items = [mockShape1, mockShape2, mockShape3, mockStickyNote1, mockStickyNote2];
        const cluster = new Set([mockShape1.id, mockShape2.id, mockShape3.id, mockStickyNote1.id, mockStickyNote2.id]);
        const colorMap = groupByColor(cluster, items);
        expect(colorMap.get('Lightning Yellow')!.size).toBe(2);
        expect(colorMap.get('Uncolored')!.size).toBe(1);
        expect(colorMap.get('Light Yellow')!.size).toBe(1);
        expect(colorMap.get('Yellow')!.size).toBe(1);
    });
});

// Test getColor function
describe('getColor', () => {
    it('should return the correct color of the item', () => {
        const items = [mockShape1, mockShape2, mockShape3, mockStickyNote1, mockStickyNote2];
        expect(getColor(mockShape1.id, items)).toBe('Lightning Yellow');
        expect(getColor(mockShape2.id, items)).toBe('Lightning Yellow');
        expect(getColor(mockShape3.id, items)).toBe('Uncolored');
        expect(getColor(mockStickyNote1.id, items)).toBe('Light Yellow');
        expect(getColor(mockStickyNote2.id, items)).toBe('Yellow');
    });
});

// Test getStickyHex function
describe('getStickyHex', () => {
    it('should return the correct hex value of the sticky note color', () => {
        expect(getStickyNoteColor(mockStickyNote1.style.fillColor)).toBe('Light Yellow');
        expect(getStickyNoteColor(mockStickyNote2.style.fillColor)).toBe('Yellow');
    });
});
