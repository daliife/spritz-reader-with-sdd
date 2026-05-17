import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeedReader } from "./SpeedReader";

describe("SpeedReader", () => {
  it("shows placeholder text in idle state", () => {
    render(<SpeedReader word="" status="idle" />);
    expect(screen.getByText(/press play to start/i)).toBeInTheDocument();
  });

  it("shows completion message in finished state", () => {
    render(<SpeedReader word="done" status="finished" />);
    expect(screen.getByText(/finished/i)).toBeInTheDocument();
  });

  it("renders the word when playing", () => {
    render(<SpeedReader word="Your" status="playing" />);
    // "Your" → left='Y', pivot='o', right='ur'
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByText("o")).toBeInTheDocument();
    expect(screen.getByText("ur")).toBeInTheDocument();
  });

  it("renders the word when paused", () => {
    render(<SpeedReader word="reading" status="paused" />);
    // "reading" → left='re', pivot='a', right='ding'
    expect(screen.getByText("re")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("ding")).toBeInTheDocument();
  });

  it("has the aria-label set to the current word", () => {
    render(<SpeedReader word="hello" status="playing" />);
    expect(screen.getByLabelText("hello")).toBeInTheDocument();
  });
});
