type Props = {
  html: string;
  open: boolean;
  fade?: boolean;
  effect?: "fade" | "reveal";
};
export default function TileFour({
  html,
  open,
  fade = true,
  effect = "fade",
}: Props) {
  return (
    <div
      className={`common ${
        effect === "fade"
          ? `${fade ? "fade" : ""}`
          : "reveal-base overflow-hidden"
      } bg-teal-950 justify-center text-white fixed bottom-0 left-0 z-[200] w-[100vw] ${
        effect === "fade"
          ? open
            ? "opacity-95 pointer-events-auto p-8"
            : "opacity-0 pointer-events-none p-8"
          : open
          ? "reveal-open pointer-events-auto p-8"
          : "reveal-closed pointer-events-none p-8"
      }`}
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
