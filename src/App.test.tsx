import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

function setLocation(search = "") {
  window.history.replaceState({}, "", search || "/");
}

describe("App", () => {
  it("renders the default outputs", () => {
    setLocation();
    render(<App />);

    expect(screen.getByText("Barred Owl Habitat Explorer")).toBeInTheDocument();
    expect(screen.getByText("0.429198")).toBeInTheDocument();
    expect(screen.getByText("42.91975")).toBeInTheDocument();
  });

  it("restores state from the URL and updates results when controls move", async () => {
    setLocation("?trees=3&dbh=30&canopy=80&qty=200");
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByLabelText("Large trees per 0.4 ha plot value")).toHaveValue(3);
    expect(screen.getByLabelText("Average diameter of overstory trees value")).toHaveValue(30);
    expect(screen.getByLabelText("Overstory canopy cover value")).toHaveValue(80);
    expect(screen.getByLabelText("Habitat quantity value")).toHaveValue(200);

    const treeSlider = screen.getByLabelText("Large trees per 0.4 ha plot");
    await user.clear(screen.getByLabelText("Large trees per 0.4 ha plot value"));
    await user.type(screen.getByLabelText("Large trees per 0.4 ha plot value"), "4");
    expect(treeSlider).toHaveValue("4");
    expect(window.location.search).toContain("trees=4");
  });
});
