import { render, screen } from "@testing-library/react";
import ReasonsList from "@/components/site/ReasonsList";

describe("ReasonsList", () => {
  it("renders reasons", () => {
    render(
      <ReasonsList
        reasons={[
          { id: "1", text: "Seu sorriso", position: 1, created_at: "" },
          { id: "2", text: "Seu abraco", position: 2, created_at: "" },
        ]}
      />,
    );

    expect(screen.getByText("Seu sorriso")).toBeInTheDocument();
    expect(screen.getByText("Seu abraco")).toBeInTheDocument();
  });
});
