"use server";

import { handleServerFunctions } from "@payloadcms/next/layouts";
import configPromise from "@payload-config";
import { importMap } from "./importMap";

export const serverFunction = async (args: any) => {
  return handleServerFunctions({
    ...args,
    config: configPromise,
    importMap,
  });
};
