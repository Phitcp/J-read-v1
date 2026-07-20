import { NextRequest, NextResponse } from "next/server";
import { segmentJapaneseImage } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { ImageInput } from "@/core/models/types";
import { handleRouteError } from "@/core/utils/handleRouteError";

const MAX_BASE64_LENGTH = 12_000_000; // ~9MB decoded, generous for a screenshot

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, providerConfig } = body as {
      image: ImageInput;
      providerConfig: ProviderConfig;
    };

    if (!image?.data || !image?.mediaType) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }
    if (image.data.length > MAX_BASE64_LENGTH) {
      return NextResponse.json({ error: "Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn." }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await segmentJapaneseImage(providerConfig, image);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
