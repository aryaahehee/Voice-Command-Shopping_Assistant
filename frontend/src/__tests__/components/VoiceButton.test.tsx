import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VoiceButton } from "@/components/voice/VoiceButton";

// Mock the useVoice hook
const mockToggle = jest.fn();
jest.mock("@/hooks/useVoice", () => ({
  useVoice: jest.fn(() => ({
    voiceState: "idle",
    isSupported: true,
    isListening: false,
    isProcessing: false,
    toggleListening: mockToggle,
  })),
}));

describe("VoiceButton", () => {
  beforeEach(() => {
    mockToggle.mockReset();
  });

  it("renders the mic button", () => {
    render(<VoiceButton />);
    expect(
      screen.getByRole("button", { name: /start listening/i })
    ).toBeInTheDocument();
  });

  it("calls toggleListening on click", () => {
    render(<VoiceButton />);
    fireEvent.click(screen.getByRole("button", { name: /start listening/i }));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("shows 'Stop listening' label when listening", () => {
    const { useVoice } = require("@/hooks/useVoice");
    useVoice.mockReturnValueOnce({
      voiceState: "listening",
      isSupported: true,
      isListening: true,
      isProcessing: false,
      toggleListening: mockToggle,
    });
    render(<VoiceButton showLabel />);
    expect(screen.getByText(/stop listening/i)).toBeInTheDocument();
  });

  it("is disabled when not supported", () => {
    const { useVoice } = require("@/hooks/useVoice");
    useVoice.mockReturnValueOnce({
      voiceState: "idle",
      isSupported: false,
      isListening: false,
      isProcessing: false,
      toggleListening: mockToggle,
    });
    render(<VoiceButton />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when processing", () => {
    const { useVoice } = require("@/hooks/useVoice");
    useVoice.mockReturnValueOnce({
      voiceState: "processing",
      isSupported: true,
      isListening: false,
      isProcessing: true,
      toggleListening: mockToggle,
    });
    render(<VoiceButton />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders sm size variant", () => {
    render(<VoiceButton size="sm" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("h-10", "w-10");
  });

  it("renders lg size variant", () => {
    render(<VoiceButton size="lg" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("h-20", "w-20");
  });
});
