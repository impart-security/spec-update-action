const core = require("@actions/core");
const fs = require("fs/promises");
const fetch = require("node-fetch");

import type { SpecPostBody, SpecsItem } from "@/openapi";

const errFailedMsg = (specId: string) => `Failed to update spec ${specId}`;
const errFailedReqMsg = (specId: string, resp: Response) =>
  `${errFailedMsg(specId)}. ${resp.status} ${resp.statusText}`;

async function run() {
  try {
    const orgId = core.getInput("org_id", { required: true });
    const specId = core.getInput("spec_id", { required: true });
    const path = core.getInput("path", { required: true });
    const accessToken = core.getInput("access_token", { required: true });
    const hostname = core.getInput("hostname") || "api.impartsecurity.net"; // optional
    let name = core.getInput("name"); // optional
    const url = `https://${hostname}/v0/orgs/${orgId}/specs/${specId}`;

    if (!name) {
      const getResp = await fetch(url, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (!getResp.ok) {
        throw new Error(errFailedReqMsg(specId, getResp));
      }

      const getResJson: SpecsItem = await getResp.json();
      name = getResJson.name;

      if (!name) {
        throw new Error(`${errFailedMsg(specId)}. Specification not found.`);
      }
    }

    const specStr = await fs.readFile(path, "utf8");
    const spec = Buffer.from(specStr).toString("base64");
    const body: SpecPostBody = {
      name,
      spec,
    };

    const putResp = await fetch(url, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (putResp.status !== 202) {
      throw new Error(errFailedReqMsg(specId, putResp));
    }
  } catch (error: any) {
    core.setFailed((error as Error).message);
  }
}

run();
