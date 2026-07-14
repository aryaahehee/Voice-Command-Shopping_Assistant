import React from "react";
import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ShoppingCart } from "lucide-react";

describe("StatsCard", () => {
  it("renders title and value", () => {
    render(
      <StatsCard title="Items Added" value={42} icon={ShoppingCart} />
    );
    expect(screen.getByText("Items Added")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <StatsCard
        title="Items Added"
        value={42}
        subtitle="All time"
        icon={ShoppingCart}
      />
    );
    expect(screen.getByText("All time")).toBeInTheDocument();
  });

  it("renders trend with positive value", () => {
    render(
      <StatsCard
        title="Items"
        value={10}
        icon={ShoppingCart}
        trend={{ value: 12, label: "vs last week" }}
      />
    );
    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs last week")).toBeInTheDocument();
  });

  it("renders trend with negative value", () => {
    render(
      <StatsCard
        title="Items"
        value={10}
        icon={ShoppingCart}
        trend={{ value: -5, label: "vs last week" }}
      />
    );
    expect(screen.getByText("-5%")).toBeInTheDocument();
  });

  it("renders skeleton when loading", () => {
    render(
      <StatsCard
        title="Items"
        value={0}
        icon={ShoppingCart}
        isLoading={true}
      />
    );
    // When loading, value should not be rendered
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    // Skeleton divs should be present
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders string values (e.g. currency)", () => {
    render(
      <StatsCard title="Total Spent" value="$24.99" icon={ShoppingCart} />
    );
    expect(screen.getByText("$24.99")).toBeInTheDocument();
  });
});
