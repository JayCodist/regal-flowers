import { fireEvent, render, screen } from "@testing-library/react";
import Modal from "./Modal";

jest.mock("@reach/router", () => ({
  navigate: jest.fn(),
  useNavigate: () => jest.fn()
}));

test("Modal is hidden when visible is false", () => {
  const onCancel = jest.fn();
  render(
    <Modal visible={false} cancel={onCancel}>
      <div>Rando content</div>
    </Modal>
  );

  const modalContent = screen.getByText("Rando content");
  const modalWrapper = modalContent.parentElement;
  expect(modalWrapper).not.toHaveClass("active");
});

test("Modal is shown when visible is true", () => {
  const onCancel = jest.fn();
  render(
    <Modal visible cancel={onCancel}>
      <div>Rando content</div>
    </Modal>
  );

  const modalContent = screen.getByText("Rando content");
  const modalWrapper = modalContent.parentElement;
  expect(modalWrapper).toHaveClass("active");
});

test("Modal is dismissed when close button is clicked", () => {
  const onCancel = jest.fn();
  render(
    <Modal visible cancel={onCancel}>
      <div>Rando content</div>
    </Modal>
  );

  const modalContent = screen.getByText("Rando content");
  const modalWrapper = modalContent.parentElement;
  const closeButton = modalWrapper?.getElementsByClassName("modal-close")[0];
  fireEvent.click(closeButton as HTMLElement);
  expect(onCancel).toHaveBeenCalled();
});
