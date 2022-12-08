import { fireEvent, render, screen } from "@testing-library/react";
import Select, { Option } from "./Select";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

const options: Option[] = [
  {
    label: "First Opt",
    value: "first_opt"
  },
  {
    label: "Second Opt",
    value: "second_opt"
  }
];

test("Select toggles dropdown upon click", () => {
  const onSelect = jest.fn();
  render(<Select options={options} onSelect={onSelect} value="" />);

  const selectElement = screen.getByRole("list");
  expect(selectElement).toBeVisible();
  const dropdown = screen.getByRole("listbox");
  expect(dropdown).not.toHaveClass("show-dropdown");
  fireEvent.click(selectElement);

  expect(dropdown).toHaveClass("show-dropdown");
});

test("Select works on option click", () => {
  const onSelect = jest.fn();
  render(<Select options={options} onSelect={onSelect} value="" />);

  const selectElement = screen.getByRole("list");
  expect(selectElement).toBeVisible();
  fireEvent.click(selectElement);

  const someOption = screen.getAllByRole("listitem")[0];
  expect(someOption).toBeVisible();
  fireEvent.click(someOption);
  expect(onSelect).toBeCalledWith("first_opt");
});
