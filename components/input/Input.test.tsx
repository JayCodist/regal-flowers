import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

test("Input works", () => {
  const onChange = jest.fn();
  render(
    <Input value="initio" onChange={onChange} placeholder="Demo placeholder" />
  );

  const input = screen.getByPlaceholderText("Demo placeholder");
  expect(input).toBeVisible();
  expect(input).toHaveDisplayValue("initio");
  userEvent.type(input, "Z");
  expect(onChange).toHaveBeenCalledWith("initioZ");
});
