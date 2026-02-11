import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NexaMart Marketplace — Premium Lifestyle & Home Essentials";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #3A4D2E 0%, #4A5D3A 40%, #5A6D4A 100%)",
                    fontFamily: "Georgia, serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: 120,
                        height: 2,
                        background: "rgba(201, 168, 76, 0.6)",
                        marginBottom: 32,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        fontSize: 80,
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "white",
                        letterSpacing: -2,
                        lineHeight: 1,
                    }}
                >
                    NexaMart
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 16,
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.7)",
                        letterSpacing: 8,
                        textTransform: "uppercase" as const,
                        marginTop: 8,
                    }}
                >
                    Marketplace
                </div>
                <div
                    style={{
                        display: "flex",
                        width: 120,
                        height: 2,
                        background: "rgba(201, 168, 76, 0.6)",
                        marginTop: 40,
                        marginBottom: 24,
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        fontSize: 22,
                        color: "rgba(255, 255, 255, 0.85)",
                        fontWeight: 400,
                    }}
                >
                    Premium Lifestyle & Home Essentials
                </div>
                <div
                    style={{
                        display: "flex",
                        fontSize: 14,
                        color: "rgba(255, 255, 255, 0.5)",
                        marginTop: 16,
                        letterSpacing: 1,
                    }}
                >
                    nexamart-marketplace.vercel.app
                </div>
            </div>
        ),
        { ...size }
    );
}
