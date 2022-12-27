import { fireEvent, render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import RangePicker from "./RangePicker";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

test("RangePicker works", () => {
  const onChange = jest.fn();
  render(<RangePicker value={[null, null]} onChange={onChange} />);

  const rangePicker = screen.getByRole("time");
  expect(rangePicker).toBeVisible();
  fireEvent.click(rangePicker);
  const sixteenthDay = screen.getByText("16");
  const eighteenthDay = screen.getByText("18");
  expect(sixteenthDay).toBeVisible();
  expect(eighteenthDay).toBeVisible();
  fireEvent.click(sixteenthDay);
  expect(onChange).toHaveBeenLastCalledWith([
    dayjs()
      .set("date", 16)
      .startOf("day"),
    null
  ]);
});
