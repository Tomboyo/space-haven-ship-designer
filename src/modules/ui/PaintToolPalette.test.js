import PaintToolPalette from "./PaintToolPalette.jsx";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as tool from "./tool/tool.js";

jest.mock("./tool/tool.js", () => {
  const actual = jest.requireActual("./tool/tool.js");
  return {
    ...actual,
    activate: jest.fn(actual.activate),
    deactivate: jest.fn(actual.deactivate),
  };
});

test.each([
  { roleArgs: ["button", { name: /Paint Hull/i }], toolName: "hull" },
  { roleArgs: ["button", { name: /Erase/i }], toolName: "erase" },
  /* Note: arbitrary module with a button visible on page load. */
  {
    roleArgs: ["button", { name: /X1 Hyperdrive/i }],
    toolName: "module X1 Hyperdrive",
  },
])(
  "can pick up the $toolName tool by clicking its tool button",
  async ({ roleArgs, toolName }) => {
    const user = userEvent.setup();
    render(
      <>
        <canvas></canvas>
        <PaintToolPalette ecs={{}} />
      </>,
    );

    tool.activate.mockClear();
    await user.click(screen.getByRole(...roleArgs));

    expect(tool.activate.mock.calls[0][0].name).toBe(toolName);
  },
);

test.each([
  { roleArgs: ["button", { name: /Paint Hull/i }], toolName: /hull/i },
  { roleArgs: ["button", { name: /Erase/i }], toolName: /erase/i },
  /* Note: arbitrary module with a button visible on page load. */
  {
    roleArgs: ["button", { name: /X1 Hyperdrive/i }],
    toolName: /module X1 Hyperdrive/i,
  },
])(
  "can put the $toolName tool down by right clicking while tool is held",
  async ({ roleArgs, toolName }) => {
    const user = userEvent.setup();

    const { container } = render(
      <>
        <canvas></canvas>
        <PaintToolPalette ecs={{}} />
      </>,
    );

    await user.click(screen.getByRole(...roleArgs));

    tool.deactivate.mockClear();
    await user.pointer({
      keys: "[MouseRight]",
      target: container.querySelector("canvas"),
    });

    expect(tool.deactivate.mock.calls[0][0].name).toMatch(toolName);
  },
);

test.each([
  { roleArgs: ["button", { name: /Paint Hull/i }], toolName: /hull/i },
  { roleArgs: ["button", { name: /Erase/i }], toolName: /erase/i },
  /* Note: arbitrary module with a button visible on page load. */
  {
    roleArgs: ["button", { name: /X1 Hyperdrive/i }],
    toolName: /module X1 Hyperdrive/i,
  },
])(
  "can put the $toolName tool down by clicking its tool button while held",
  async ({ roleArgs, toolName }) => {
    const user = userEvent.setup();
    render(
      <>
        <canvas />
        <PaintToolPalette ecs={{}} />
      </>,
    );

    await user.click(screen.getByRole(...roleArgs));

    await user.pointer({
      keys: "[MouseLeft]",
      target: screen.getByRole(...roleArgs),
    });

    expect(tool.deactivate.mock.lastCall[0].name).toMatch(toolName);
  },
);

test("can change tools by clicking a different tool button", async () => {
  const user = userEvent.setup();
  render(
    <>
      <canvas />
      <PaintToolPalette ecs={{}} />
    </>,
  );

  await user.click(screen.getByRole("button", { name: /Paint Hull/i }));
  expect(tool.activate.mock.lastCall[0].name).toMatch(/hull/i);

  await user.click(screen.getByRole("button", { name: /Erase/i }));
  expect(tool.activate.mock.lastCall[0].name).toMatch(/erase/i);

  await user.click(screen.getByRole("button", { name: /X1 Hyperdrive/i }));
  expect(tool.activate.mock.lastCall[0].name).toMatch(/module x1 hyperdrive/i);
});
