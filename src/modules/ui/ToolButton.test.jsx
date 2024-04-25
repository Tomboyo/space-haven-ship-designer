import ToolButton from "./ToolButton.jsx";
import renderer from "react-test-renderer";
import { cleanup, fireEvent, render } from "@testing-library/react";

it("Uses active styling when active", () => {
  const component = renderer.create(
    <ToolButton active={true} onClick={() => {}} />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Does not use active styling when inactive", () => {
  const component = renderer.create(
    <ToolButton active={false} onClick={() => {}} />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

it("Triggers onClick callback when clicked", () => {
  const mockOnClick = jest.fn();
  const { queryByText, getByText } = render(
    <ToolButton active={false} onClick={mockOnClick}>
      Label
    </ToolButton>,
  );

  expect(queryByText(/Label/i)).toBeTruthy();
  fireEvent.click(getByText(/Label/i));

  expect(mockOnClick.mock.instances.length).toBe(1);
});
