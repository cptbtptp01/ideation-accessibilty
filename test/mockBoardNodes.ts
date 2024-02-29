/* This file is a mock of the board nodes data structure. It is used to test the grouping functions. */

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
    color: "#1a1a1a",
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
  rotation: 0,
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
    color: "#1a1a1a",
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
  rotation: 0,
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
    color: "#1a1a1a",
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
  rotation: 0,
};

export const mockStickyNote1 = {
  type: "sticky_note",
  attributes: {
    text: "<p>ssss</p>",
    style: {
      backgroundColor: "cyan",
      textAlign: "center",
      textAlignVertical: "middle",
    },
    geometry: {
      x: 4869.786152365592,
      y: 2504.686165346242,
      width: 762.1591909669559,
      height: 873.2276157812358,
    },
    parentId: null,
  },
  id: "3458764579564312953",
};

export const mockStickyNote2 = {
  type: "sticky_note",
  shape: "square",
  content: "<p>sticker2</p>",
  style: {
    fillColor: "yellow",
    textAlign: "center",
    textAlignVertical: "middle",
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
  height: 243.96,
};

export const mockStickyNote3 = {
  type: "sticky_note", // check
  shape: "square",
  content: "",
  style: {
    fillColor: "yellow",
    textAlign: "center",
    textAlignVertical: "middle",
  },
  tagIds: [],
  id: "101", // check
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-19T23:23:31.832Z",
  createdBy: "3458764575728178245",
  modifiedAt: "2024-02-26T01:23:51.819Z",
  modifiedBy: "3458764561136524777",
  connectorIds: [],
  x: 100.0, // check
  y: 200.0, // check
  width: 39.99999, // check
  height: 50.00008, // check
};

export const mockConnector1 = {
  type: "connector", // check
  id: "102", // check
  style: {
    startStrokeCap: "none",
    endStrokeCap: "rounded_stealth",
    strokeStyle: "normal",
    strokeWidth: 2,
    strokeColor: "#333333",
    color: "#1a1a1a",
    textOrientation: "horizontal",
  },
  start: {
    item: "123456789",
    position: {
      x: 1,
      y: 0.5,
    },
    snapTo: "right",
  },
  end: {
    item: "anotherItemId",
    position: {
      x: 0,
      y: 0.5,
    },
    snapTo: "left",
  },
  captions: [],
  parentId: null,
  origin: "center",
  relativeTo: "canvas_center",
  createdAt: "2024-02-26T07:13:30.464Z",
  createdBy: "3458764561136524777",
  modifiedAt: "2024-02-26T07:13:30.464Z",
  modifiedBy: "3458764561136524777",
};
