import PaintToolPalette from "./PaintToolPalette.jsx";
import { fireEvent, render } from "@testing-library/react";

/*
 * Need something we can inject to palette where side-effect of picking and
 * dropping tool will appear. The Brush could be a singleton instance we pass
 * in, and picking tools is achieved by invoking brush.activate(tool). This has
 * the advantage that we can't forget to put a tool down.
 */
test.todo("can pick up a tool by clicking a tool button");
test.todo("can put tool down by right clicking with held tool");
test.todo("can put tool down by clicking held tool's tool button");
test.todo("can change tools by clicking a different tool button");
