import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

test("Button works", () => {
  const onClick = jest.fn();
  render(
    <Button onClick={onClick}>
      <div>Test Child</div>
    </Button>
  );

  const button = screen.getByText("Test Child");
  expect(button).toBeVisible();
  fireEvent.click(button as HTMLButtonElement);
  expect(onClick).toHaveBeenCalled();
});
