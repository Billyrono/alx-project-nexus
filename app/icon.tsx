import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #3A4D2E 0%, #4A5D3A 100%)",
                    fontFamily: "Georgia, serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        fontSize: 22,
                        fontWeight: 700,
                        fontStyle: "italic",
                        color: "white",
                        lineHeight: 1,
                        marginTop: -1,
                    }}
                >
                    N
                </div>
            </div>
        ),
        { ...size }
    );
}
