import * as Layer from "effect/Layer";
import * as FetchHttpClient from "effect/unstable/http/FetchHttpClient";
import * as Provider from "../Provider.ts";
import { NeonAuth } from "./Auth/AuthProvider.ts";
import { Branch, BranchProvider } from "./Branch.ts";
import * as Credentials from "./Credentials.ts";
import { NeonEnvironment, fromProfile } from "./NeonEnvironment.ts";
import { Project, ProjectProvider } from "./Project.ts";

export { NeonEnvironment } from "./NeonEnvironment.ts";

export class Providers extends Provider.ProviderCollection<Providers>()(
  "Neon",
) {}

export type ProviderRequirements = Layer.Services<ReturnType<typeof providers>>;

/**
 * Build a layer that registers all Neon resource providers, the Neon
 * `AuthProvider`, the resolved `Credentials`, and an `HttpClient`. Include
 * this from your stack alongside other cloud `providers()` layers.
 *
 * @example
 * ```typescript
 * const stack = Stack.make("my-stack").pipe(
 *   Stack.provide(Neon.providers()),
 * );
 * ```
 */
export const providers = () =>
  Layer.effect(
    Providers,
    Provider.collection([Project, Branch]),
  ).pipe(
    Layer.provide(
      Layer.mergeAll(ProjectProvider(), BranchProvider()),
    ),
    Layer.provideMerge(Credentials.fromAuthProvider()),
    Layer.provideMerge(fromProfile()),
    Layer.provideMerge(NeonAuth),
    Layer.provideMerge(FetchHttpClient.layer),
    Layer.orDie,
  );
