import { renderHook, act } from "@testing-library/react";
import { useVoiceStore } from "@/store/useVoiceStore";
import type { ParsedVoiceCommand } from "@/types";

const MOCK_COMMAND: ParsedVoiceCommand = {
  action: "add",
  itemName: "milk",
  quantity: 2,
  unit: "l",
  rawTranscript: "add 2 litres of milk",
  confidence: 0.92,
  language: "en-US",
};

describe("useVoiceStore", () => {
  beforeEach(() => {
    useVoiceStore.setState({
      voiceState: "idle",
      transcript: "",
      interimTranscript: "",
      lastCommand: null,
      language: "en-US",
      isSupported: false,
      error: null,
    });
  });

  it("sets voice state", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setVoiceState("listening"));
    expect(result.current.voiceState).toBe("listening");
  });

  it("sets transcript", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setTranscript("add milk"));
    expect(result.current.transcript).toBe("add milk");
  });

  it("sets interim transcript", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setInterimTranscript("add mil…"));
    expect(result.current.interimTranscript).toBe("add mil…");
  });

  it("stores last command", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setLastCommand(MOCK_COMMAND));
    expect(result.current.lastCommand?.action).toBe("add");
    expect(result.current.lastCommand?.itemName).toBe("milk");
    expect(result.current.lastCommand?.confidence).toBe(0.92);
  });

  it("sets language", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setLanguage("es-ES"));
    expect(result.current.language).toBe("es-ES");
  });

  it("sets isSupported", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setIsSupported(true));
    expect(result.current.isSupported).toBe(true);
  });

  it("sets error", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => result.current.setError("Microphone not available"));
    expect(result.current.error).toBe("Microphone not available");
  });

  it("resets state to initial values", () => {
    const { result } = renderHook(() => useVoiceStore());
    act(() => {
      result.current.setVoiceState("listening");
      result.current.setTranscript("add milk");
      result.current.setLastCommand(MOCK_COMMAND);
      result.current.setError("some error");
    });
    act(() => result.current.reset());
    expect(result.current.voiceState).toBe("idle");
    expect(result.current.transcript).toBe("");
    expect(result.current.lastCommand).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
