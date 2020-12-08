import { generateClientFromConfig } from "@querycap-dev/generate-client";
import path from "path";
import { Dictionary, keys, startsWith } from "lodash";
import { prompt } from "inquirer";

import { pathExistsSync, readdirSync } from "fs-extra";

(async () => {
  const apps = findApps();

  const inputApp = process.argv[2];

  const answers = await ask(inputApp, "Web App", keys(apps));

  const app = apps[answers];

  if (!app) {
    console.error(`unknown app ${answers.app}`);
    return;
  }

  const appConfig = app.APP_CONFIG;

  const conf = {} as { [key: string]: string };
  for (const i in appConfig) {
    if (startsWith(i, "SRV_")) {
      const getValue = (appConfig as any)[i];
      conf[i] = getValue("", "");
    }
  }

  await generateClientFromConfig(conf, {
    cwd: path.join(__dirname, "../../"),
    clientCreator: "src-core/request.createRequestActor",
  });
})();

async function ask(value: string, msg: string, choices: string[]) {
  if (choices.includes(value)) {
    return value;
  }
  const answer = await prompt([
    {
      type: "list",
      message: msg,
      name: "result",
      choices,
    },
  ]);

  return answer.result;
}

type TEnvVarBuilder = (env: string, feature: string, app: string) => string;

function findApps() {
  const apps: Dictionary<{
    index: number;
    name: string;
    APP_CONFIG: {
      [key: string]: TEnvVarBuilder;
    };
    GROUP?: string;
    DESCRIPTION?: string;
    ENVS?: Dictionary<string>;
    APP_MANIFEST?: any;
  }> = {};

  const base = path.join(__dirname, "../../src-app");

  readdirSync(base).forEach((name, index) => {
    const configFile = path.join(base, name, "config.ts");

    if (pathExistsSync(configFile)) {
      apps[name] = {
        ...require(configFile),
        name,
        index,
      };
    }
  });

  return apps;
}
