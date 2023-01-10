import { Hct, hexFromArgb } from '@material/material-color-utilities';
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'create-color') {

    // Get the number of selected elements
    let selectedElements = figma.currentPage.selection.length

    // Display error messages on invalid sleection
    if (selectedElements === 0) {
        figma.closePlugin('No element selected!')
        return
    }

    if (selectedElements > 1) {
      figma.closePlugin('Please select a single element!')
      return
    }



    // Fill the current selection
    const node: SceneNode = figma.currentPage.selection[0];
    if (node.type === 'RECTANGLE') {

      // make sure the HCT input is in correct format
      if (msg.huevalue || msg.chromavalue || msg.tonevalue === undefined || msg.huevalue.length || msg.chromavalue.length || msg.tonevalue.length  === 0) {
        figma.closePlugin( 'HCT values are undefined');
      }
      if (msg.huevalue.some(isNaN) || msg.chromavalue.some(isNaN)  || msg.tonevalue.some(isNaN)) {
        figma.closePlugin( 'HCT values are not numbers');
      }

      const color = Hct.from(Number(msg.huevalue), Number(msg.chromavalue), Number(msg.tonevalue));
      const hex = hexFromArgb(color.toInt());

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        let r = 0;
        let g = 0;
        let b = 0;
        if (result) {
           const color = {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          };
          r = color.r;
          g = color.g;
          b = color.b;
        } else {
          figma.closePlugin('Invalid color string')
        }
      
      console.log(hex)
      const rect = node;
      rect.fills = [{ type: 'SOLID', color: { r, g, b} }];
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
};