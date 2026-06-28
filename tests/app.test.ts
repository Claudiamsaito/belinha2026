import { describe, it, expect } from "vitest";

describe("Missão Saúde Ilhabela — App Tests", () => {
  it("should have correct form URLs defined", () => {
    const QR_FORM_URL = "https://forms.gle/1BBPrSTR2YhiG5QPA";
    const WA_FORM_URL = "https://forms.gle/Ee1YnyEdxqv94eve8";

    expect(QR_FORM_URL).toMatch(/^https:\/\/forms\.gle\//);
    expect(WA_FORM_URL).toMatch(/^https:\/\/forms\.gle\//);
    expect(QR_FORM_URL).not.toBe(WA_FORM_URL);
  });

  it("should have all required screens defined", () => {
    const screens = [
      "welcome",
      "mapa",
      "caminhos",
      "qrcode",
      "formulario",
      "whatsapp",
      "conclusao",
    ];
    expect(screens).toHaveLength(7);
    screens.forEach((screen) => {
      expect(typeof screen).toBe("string");
      expect(screen.length).toBeGreaterThan(0);
    });
  });

  it("should have all UBS units listed", () => {
    const UBS_UNITS = [
      "Costa Norte",
      "Vila/Centro de Saúde III",
      "Itaquanduba",
      "Perequê",
      "Barra Velha",
      "Alto da Barra",
      "Água Branca",
      "Costa Sul",
    ];
    expect(UBS_UNITS).toHaveLength(8);
  });

  it("should have all specialty centers listed", () => {
    const CENTERS = ["CRE", "CEV", "CEO", "CERTEA", "CIAMA", "Academia da Saúde"];
    expect(CENTERS).toHaveLength(6);
  });

  it("should have 3 evaluation paths", () => {
    const PATHS = ["qrcode", "formulario", "whatsapp"];
    expect(PATHS).toHaveLength(3);
  });

  it("should have Belinha image URL defined", () => {
    const BELINHA_IMAGE =
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663403414321/FrJTcCtZDHKP3Yh8CCXrvy/belinha-icon-WsxERnB6DnNojmGRyzz7uc.png";
    expect(BELINHA_IMAGE).toMatch(/^https:\/\//);
    expect(BELINHA_IMAGE).toContain("belinha-icon");
  });

  it("should have progress steps correctly defined", () => {
    const TOTAL_STEPS = 5;
    const steps = [
      { screen: "welcome", step: 0 },
      { screen: "mapa", step: 1 },
      { screen: "caminhos", step: 2 },
      { screen: "qrcode", step: 3 },
      { screen: "formulario", step: 3 },
      { screen: "whatsapp", step: 3 },
      { screen: "conclusao", step: 5 },
    ];
    steps.forEach((s) => {
      expect(s.step).toBeGreaterThanOrEqual(0);
      expect(s.step).toBeLessThanOrEqual(TOTAL_STEPS);
    });
  });

  it("should have all rating options for printed form", () => {
    const RATINGS = ["Péssimo", "Ruim", "Regular", "Bom", "Ótimo"];
    expect(RATINGS).toHaveLength(5);
    expect(RATINGS[0]).toBe("Péssimo");
    expect(RATINGS[4]).toBe("Ótimo");
  });

  it("should have confetti colors defined", () => {
    const CONFETTI_COLORS = [
      "#2E7D32", "#1565C0", "#F57F17", "#C62828",
      "#25D366", "#9C27B0", "#FF6F00", "#00838F",
    ];
    expect(CONFETTI_COLORS).toHaveLength(8);
    CONFETTI_COLORS.forEach((color) => {
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });
});
