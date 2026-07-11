"use server";

import { randomUUID } from "node:crypto";
import Mux from "@mux/mux-node";
import jwt from "jsonwebtoken";
import { decodeMuxSigningKey, formatSigningKey } from "@/lib/mux";
import { writeClient } from "@/sanity/lib/client";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

interface CreateUploadResult {
  uploadUrl: string | null;
  uploadId: string | null;
  error?: string;
}

export async function createMuxUploadUrl(): Promise<CreateUploadResult> {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return {
      uploadUrl: null,
      uploadId: null,
      error: "Mux API credentials are not configured",
    };
  }

  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["signed"],
        video_quality: "plus",
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English CC",
              },
            ],
          },
        ],
      },
    });

    return {
      uploadUrl: upload.url ?? null,
      uploadId: upload.id ?? null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create upload URL";

    console.error("Mux upload URL creation error:", error);
    return { uploadUrl: null, uploadId: null, error: errorMessage };
  }
}

interface MuxAssetStatus {
  status: "waiting" | "preparing" | "ready" | "errored" | null;
  playbackId: string | null;
  assetId: string | null;
  sanityAssetId: string | null;
  error?: string;
}

export async function getMuxUploadStatus(
  uploadId: string,
): Promise<MuxAssetStatus> {
  if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
    return {
      status: null,
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
      error: "Mux API credentials are not configured",
    };
  }

  try {
    const upload = await mux.video.uploads.retrieve(uploadId);

    if (upload.asset_id) {
      const asset = await mux.video.assets.retrieve(upload.asset_id);
      const signedPlayback = asset.playback_ids?.find(
        (p) => p.policy === "signed",
      );

      // If asset is ready, create/update the Sanity mux.videoAsset document
      if (asset.status === "ready" && signedPlayback) {
        // Generate a UUID for the Sanity document (matching plugin format)
        const sanityAssetId = randomUUID();

        // Create the mux.videoAsset document in Sanity
        // Structure matches what sanity-plugin-mux-input creates
        await writeClient.createOrReplace({
          _id: sanityAssetId,
          _type: "mux.videoAsset",
          status: asset.status,
          assetId: asset.id,
          playbackId: signedPlayback.id,
          uploadId: asset.upload_id,
          data: {
            aspect_ratio: asset.aspect_ratio,
            created_at: asset.created_at,
            duration: asset.duration,
            encoding_tier: asset.encoding_tier,
            id: asset.id,
            ingest_type: asset.ingest_type,
            master_access: asset.master_access,
            max_resolution_tier: asset.max_resolution_tier,
            max_stored_frame_rate: asset.max_stored_frame_rate,
            max_stored_resolution: asset.max_stored_resolution,
            mp4_support: asset.mp4_support,
            passthrough: sanityAssetId,
            playback_ids: asset.playback_ids?.map((p) => ({
              id: p.id,
              policy: p.policy,
            })),
            resolution_tier: asset.resolution_tier,
            status: asset.status,
            tracks: asset.tracks,
            upload_id: asset.upload_id,
            video_quality: asset.video_quality,
          },
        });

        return {
          status: asset.status as MuxAssetStatus["status"],
          playbackId: signedPlayback.id,
          assetId: asset.id,
          sanityAssetId,
        };
      }

      return {
        status: asset.status as MuxAssetStatus["status"],
        playbackId: signedPlayback?.id ?? null,
        assetId: asset.id,
        sanityAssetId: null,
      };
    }

    return {
      status: "waiting",
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to get upload status";

    return {
      status: null,
      playbackId: null,
      assetId: null,
      sanityAssetId: null,
      error: errorMessage,
    };
  }
}

interface MuxTokensResult {
  playbackToken: string | null;
  thumbnailToken: string | null;
  storyboardToken: string | null;
  error?: string;
  debug?: string;
}

interface MuxSecretsDocument {
  signingKeyId?: string | null;
  signingKeyPrivate?: string | null;
}

async function getMuxSigningCredentials() {
  const signingKey = process.env.MUX_SIGNING_KEY;
  const signingKeyId = process.env.MUX_SIGNING_KEY_ID;

  if (signingKey && signingKeyId) {
    return {
      signingKey,
      signingKeyId,
    };
  }

  const secrets = await writeClient.fetch<MuxSecretsDocument | null>(
    `*[_id == "secrets.mux"][0]{
      signingKeyId,
      signingKeyPrivate
    }`,
  );

  if (secrets?.signingKeyId && secrets.signingKeyPrivate) {
    return {
      signingKey: decodeMuxSigningKey(secrets.signingKeyPrivate),
      signingKeyId: secrets.signingKeyId,
    };
  }

  return null;
}

export async function getMuxSignedTokens(
  playbackId: string | null | undefined,
): Promise<MuxTokensResult> {
  if (!playbackId) {
    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: "playbackId is required",
    };
  }

  try {
    const credentials = await getMuxSigningCredentials();

    if (!credentials) {
      return {
        playbackToken: null,
        thumbnailToken: null,
        storyboardToken: null,
        error:
          "مفاتيح توقيع Mux غير مهيأة. أضف MUX_SIGNING_KEY_ID و MUX_SIGNING_KEY أو فعّل Signed URLs من Sanity Mux plugin.",
      };
    }

    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const formattedKey = formatSigningKey(credentials.signingKey);

    // Generate playback token (aud: "v")
    const playbackToken = jwt.sign(
      {
        aud: "v",
        exp: expirationTime,
        kid: credentials.signingKeyId,
        sub: playbackId,
      },
      formattedKey,
      { algorithm: "RS256" },
    );

    // Generate thumbnail token (aud: "t")
    const thumbnailToken = jwt.sign(
      {
        aud: "t",
        exp: expirationTime,
        kid: credentials.signingKeyId,
        sub: playbackId,
      },
      formattedKey,
      { algorithm: "RS256" },
    );

    // Generate storyboard token (aud: "s")
    const storyboardToken = jwt.sign(
      {
        aud: "s",
        exp: expirationTime,
        kid: credentials.signingKeyId,
        sub: playbackId,
      },
      formattedKey,
      { algorithm: "RS256" },
    );

    return { playbackToken, thumbnailToken, storyboardToken };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to generate signed tokens";

    return {
      playbackToken: null,
      thumbnailToken: null,
      storyboardToken: null,
      error: errorMessage,
      debug: error instanceof Error ? error.stack : String(error),
    };
  }
}

// Legacy function for backwards compatibility
export async function getMuxSignedToken(
  playbackId: string | null | undefined,
): Promise<{ token: string | null; error?: string; debug?: string }> {
  const result = await getMuxSignedTokens(playbackId);
  return {
    token: result.playbackToken,
    error: result.error,
    debug: result.debug,
  };
}
