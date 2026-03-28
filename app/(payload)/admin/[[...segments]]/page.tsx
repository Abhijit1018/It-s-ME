import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { importMap } from "@/app/(payload)/importMap";
import configPromise from "@payload-config";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export async function generateMetadata({ params, searchParams }: Args) {
  // @ts-expect-error - Expected type mismatch between Client/Handler in Payload types
  return generatePageMetadata({ config: configPromise, importMap, params, searchParams });
}

export default async function Admin({ params, searchParams }: Args) {
  // @ts-expect-error - Expected type mismatch between Client/Handler in Payload types
  return RootPage({ config: configPromise, importMap, params, searchParams });
}
