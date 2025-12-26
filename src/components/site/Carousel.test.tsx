import { render, screen } from "@testing-library/react";
import Carousel from "@/components/site/Carousel";

const items = [
  { id: "1", imageUrl: "/uploads/carousel/one.webp", caption: "Momento 1" },
  { id: "2", imageUrl: "/uploads/carousel/two.webp", caption: "Momento 2" },
];

describe("Carousel", () => {
  it("renders carousel images and controls", () => {
    render(<Carousel items={items} />);

    expect(screen.getByAltText("Momento 1")).toBeInTheDocument();
    expect(screen.getByAltText("Momento 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /foto anterior/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proxima foto/i })).toBeInTheDocument();
  });
});
