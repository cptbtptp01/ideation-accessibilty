/* This file is a mock of the board nodes data structure. It is used to test the grouping functions. */

// frame - empty
export const emptyFrame = {
  type: "frame",
  title: "Frame 1",
  childrenIds: [],
  style: {
    fillColor: "#ffffff"
  },
  id: "frame1",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-29T03:31:14.020Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-29T03:31:26.361Z",
  modifiedBy: "3458764575728178245",
  x: -2933.759775307095,
  y: 2495.4418699295593,
  height: 791,
  width: 1439.2202166064983,
  showContent: true
};

// group - groups cannot be empty
export const group = {
  type: "group",
  itemsIds: ["3458764580516886689", "3458764580516886705"],
  id: "group1"
};

// shape - round rec - content - fill - border
export const mockShape1 = {
  type: "shape",
  content: "<p>this is content</p>",
  shape: "round_rectangle",
  style: {
    fillColor: "#fac710",
    fontFamily: "open_sans",
    fontSize: 28,
    textAlign: "center",
    textAlignVertical: "middle",
    borderStyle: "normal",
    borderOpacity: 1,
    borderColor: "#1a1a1a",
    borderWidth: 2,
    fillOpacity: 1,
    color: "#1a1a1a"
  },
  id: "3458764580516886289",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-27T23:01:49.836Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-28T04:32:06.939Z",
  modifiedBy: "3458764575728178245",
  connectorIds: [],
  x: -2078.8002239449133,
  y: 1259.070165330662,
  width: 304,
  height: 156,
  rotation: 0
};

// shape - round rec - content - fill
export const mockShape2 = {
  type: "shape",
  content: "<p>this is content</p>",
  shape: "round_rectangle",
  style: {
    fillColor: "#fac710",
    fontFamily: "open_sans",
    fontSize: 28,
    textAlign: "center",
    textAlignVertical: "middle",
    borderStyle: "normal",
    borderOpacity: 1,
    borderColor: "transparent",
    borderWidth: 2,
    fillOpacity: 1,
    color: "#1a1a1a"
  },
  id: "3458764580530425719",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-28T03:56:21.459Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-28T03:59:18.448Z",
  modifiedBy: "3458764575728178245",
  connectorIds: [],
  x: -1724.8002239449133,
  y: 1259.070165330662,
  width: 304,
  height: 156,
  rotation: 0
};

export const mockShape3 = {
  type: "shape",
  content: "<p>this is content</p>",
  shape: "round_rectangle",
  style: {
    fillColor: "transparent",
    fontFamily: "open_sans",
    fontSize: 28,
    textAlign: "center",
    textAlignVertical: "middle",
    borderStyle: "normal",
    borderOpacity: 1,
    borderColor: "#1a1a1a",
    borderWidth: 2,
    fillOpacity: 1,
    color: "#1a1a1a"
  },
  id: "3458764580530425796",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-28T03:56:28.141Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-28T04:32:08.875Z",
  modifiedBy: "3458764575728178245",
  connectorIds: [],
  x: -1366.8002239449133,
  y: 1259.070165330662,
  width: 304,
  height: 156,
  rotation: 0
};

export const mockStickyNote1 = {
  type: "sticky_note",
  shape: "square",
  content: "<p>sticker1</p>",
  style: {
    fillColor: "light_yellow",
    textAlign: "center",
    textAlignVertical: "middle"
  },
  tagIds: [],
  id: "3458764580516885999",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-27T23:01:04.686Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-28T04:43:06.560Z",
  modifiedBy: "3458764575728178245",
  connectorIds: [],
  x: -2712.8002239449133,
  y: 1165.070165330662,
  width: 212.93,
  height: 243.96
};

export const mockStickyNote2 = {
  type: "sticky_note",
  shape: "square",
  content: "<p>sticker2</p>",
  style: {
    fillColor: "yellow",
    textAlign: "center",
    textAlignVertical: "middle"
  },
  tagIds: [],
  id: "3458764580516886689",
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-27T23:02:58.420Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-28T05:06:03.861Z",
  modifiedBy: "3458764575728178245",
  connectorIds: [],
  x: -2712.8002239449133,
  y: 1409.030165330662,
  width: 212.93,
  height: 243.96
};
