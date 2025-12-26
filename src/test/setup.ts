import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;

class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.IntersectionObserver = IntersectionObserver;

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    const { src, alt, ...rest } = props;
    const imgProps = { ...rest } as Record<string, unknown>;
    delete imgProps.fill;
    delete imgProps.priority;
    return React.createElement("img", {
      src: typeof src === "string" ? src : "",
      alt,
      ...imgProps,
    });
  },
}));
