import { fireEvent, render, screen } from "@testing-library/react";
import Checkbox from "./Checkbox";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

test("Checkbox works when unchecked", () => {
  const onChange = jest.fn();
  render(<Checkbox checked={false} onChange={onChange} text="CB Text" />);

  const checkbox = screen.getByText("CB Text");
  expect(checkbox).toBeVisible();
  fireEvent.click(checkbox as HTMLButtonElement);
  expect(onChange).toHaveBeenCalledWith(true);
  const innerInput = checkbox.parentElement?.getElementsByTagName("input")[0];
  expect(innerInput).toBeInTheDocument();
  expect(innerInput).not.toBeChecked();
});

test("Checkbox works when checked", () => {
  const onChange = jest.fn();
  render(<Checkbox checked onChange={onChange} text="CB Text" />);

  const checkbox = screen.getByText("CB Text");
  expect(checkbox).toBeVisible();
  fireEvent.click(checkbox as HTMLButtonElement);
  expect(onChange).toHaveBeenCalledWith(false);
  const innerInput = checkbox.parentElement?.getElementsByTagName("input")[0];
  expect(innerInput).toBeInTheDocument();
  expect(innerInput).toBeChecked();
});
