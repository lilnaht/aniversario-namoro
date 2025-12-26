import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import RelationshipCounter from "@/components/site/RelationshipCounter";

describe("RelationshipCounter", () => {
  it("shows elapsed time segments", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-02T01:00:00Z"));

    render(<RelationshipCounter startDate="2024-01-01T00:00:00Z" />);

    const anos = screen.getByText("Anos").parentElement;
    const meses = screen.getByText("Meses").parentElement;
    const dias = screen.getByText("Dias").parentElement;
    const horas = screen.getByText("Horas").parentElement;

    expect(anos?.querySelector("p")?.textContent).toBe("1");
    expect(meses?.querySelector("p")?.textContent).toBe("0");
    expect(dias?.querySelector("p")?.textContent).toBe("1");
    expect(horas?.querySelector("p")?.textContent).toBe("1");

    vi.useRealTimers();
  });
});
