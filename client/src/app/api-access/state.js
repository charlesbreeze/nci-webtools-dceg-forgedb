import { selector } from "recoil";

export const specSelector = selector({
  key: "api-access.spec",
  get: async () => {
    const host = process.env.NODE_ENV === "development" ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}` : ``;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const specUrl = `${host}${baseUrl}/api/openapi.json`;
    const response = await fetch(specUrl, { cache: "no-cache" });
    const spec = await response.json();
    spec.servers = [
      {
        url: baseUrl,
      },
    ]
    return spec;
  },
});