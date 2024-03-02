// WIP to be updated after confirm the function

import { emptyFrame, group, mockStickyNote2 } from "./mockBoardNodes";

// mock actual global variables
const frameSet: Set<string> = new Set();
const groupSet: Set<string> = new Set();

// mock actual function
function clusterByParent(items: any[]): Map<string, string[]> {
  const clusters: Map<string, string[]> = new Map();

  if (frameSet.size > 0) {
    for (const parentId of frameSet) {
      const parent = items.find((item) => item.id === parentId);
      const childrenIds = parent.childrenIds;
      clusters.set(parentId, childrenIds);
    }
  }

  if (groupSet.size > 0) {
    for (const parentId of groupSet) {
      const parent = items.find((item) => item.id === parentId);
      const childrenIds = parent.itemsIds;
      clusters.set(parentId, childrenIds);
    }
  }
  // todo(hy): test floatingSet
  return clusters;
}

function groupByTypes(cluster: string[], items: any[]): Map<string, string[]> {
  const typeMap: Map<string, string[]> = new Map();
  for (const id of cluster) {
    const item = items.find((item) => item.id === id);
    if(item) {
      if (item.type in typeMap) {
        typeMap.get(item.type)?.push(id);
      } else {
        typeMap.set(item.type, [id]);
      }
    }
  }
  return typeMap;
}

describe("clusterByUserDefinedParent", () => {
  it("should group items by parent", () => {
    frameSet.add("frame1");
    groupSet.add("group1");
    const items = [emptyFrame, group];
    const clusters = clusterByParent(items);
    expect(clusters.get("frame1")).toEqual([]);
    expect(clusters.get("group1")).toEqual(["3458764580516886689", "3458764580516886705"]);
  });
});

describe("groupByTypes", () => {
  it("should group items by type", () => {
    frameSet.add("frame1");
    groupSet.add("group1");
    const items = [group, mockStickyNote2, emptyFrame];
    const clusters = clusterByParent(items);
    const typeMap1 = groupByTypes(clusters.get("group1")!, items);
    expect(typeMap1.get("sticky_note")).toEqual(["3458764580516886689"]);
  });
});
