/* This file is a mock of the board nodes data structure. It is used to test the grouping functions. */

export const mockShape1 = {
  content: "<p>This is a star shape.</p>",
  shape: "star",
  style: {
    color: "#ff0000",
    fillColor: "#ffff00",
    fontFamily: "arial",
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "middle",
    borderStyle: "normal",
    borderOpacity: 1.0,
    borderColor: "#ff7400",
    borderWidth: 2,
    fillOpacity: 1.0,
  },
  x: 0,
  y: 0,
  width: 200,
  height: 200,
};

export const mockShape2 = {
  content: "<p>This is a rectangle shape.</p>",
  shape: "rectangle",
  style: {
    color: "#00ff00",
    fillColor: "#00ffff",
    fontFamily: "arial",
    fontSize: 14,
    textAlign: "center",
    textAlignVertical: "middle",
    borderStyle: "normal",
    borderOpacity: 1.0,
    borderColor: "#0074ff",
    borderWidth: 2,
    fillOpacity: 1.0,
  },
  x: 100,
  y: 100,
  width: 200,
  height: 200,
};

export const mockStickyNote1 = {
  content:
    "<p>This is a sticky note. It looks just like the actual paper one.</p>",
  style: {
    fillColor: "light_yellow", // Default value: light yellow
    textAlign: "center", // Default alignment: center
    textAlignVertical: "middle", // Default alignment: middle
  },
  x: 0, // Default value: horizontal center of the board
  y: 0, // Default value: vertical center of the board
  shape: "square",
  width: 200, // Set either 'width', or 'height'
};
