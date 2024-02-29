import { emptyFrame, group, mockShape1, mockStickyNote1 } from "./mockBoardNodes";

const frameSet : Set<string> = new Set();
const groupSet : Set<string> = new Set();
const floatingSet : Set<string> = new Set();

function clusterByType(items: any[]): Set<string>[] {
    let clusters : Set<string>[] = [];
    items.forEach((item) => {
        if (item.type === "frame") {
            frameSet.add(item.id);
        } else if (item.type === "group") {
            groupSet.add(item.id);
        } else {
            // tbd for future implementation
            floatingSet.add(item.id);
        }
    });
    // add frameSet, groupSet, floatingSet to a list
    clusters.push(frameSet, groupSet, floatingSet);
    return clusters;
}

describe('clusterByType', () => {
    it('should accept empty cluster', () => {
        const items = [emptyFrame, group];
        const clusters = clusterByType(items);
        expect(clusters[0].size).toBe(1);
        expect(clusters[1].size).toBe(1);
        expect(clusters[2].size).toBe(0);
    });
});

describe('clusterByType', () => {
    it('should group items by type (gorup, frame. floating)', () => {
        const items = [emptyFrame, group, mockShape1, mockStickyNote1];
        const clusters = clusterByType(items);
        expect(clusters[0].size).toBe(1);
        expect(clusters[1].size).toBe(1);
        expect(clusters[2].size).toBe(2);
    });
})
