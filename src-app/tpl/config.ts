import {confLoader} from "@querycap/config";

export enum ENVS {
  STAGING = "STAGING",
  TEST = "TEST",
  DEMO = "DEMO",
  ONLINE = "ONLINE",
  LOCAL = "LOCAL",
}

export const APP_MANIFEST = {
  name: "tpl",
  background_color: "#19C7B1",
  crossorigin: "use-credentials"
};

export const APP_CONFIG = {
  SRV_TEST: (env: string, feature: string) => {
    if (env === "local") {
      return `//127.0.0.1:80`;
    }

    if (feature === "demo") {
      return `//demo.com`;
    }

    return `//demo.querycap.com`;
  }
};

export const conf = confLoader<keyof typeof APP_CONFIG>();
