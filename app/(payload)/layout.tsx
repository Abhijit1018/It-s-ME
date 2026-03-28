import "@payloadcms/next/css";
import React from "react";
import configPromise from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import { importMap } from "./importMap";
import { serverFunction } from "./serverFunction";

export default function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
