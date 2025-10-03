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
    <>
      {effect === "fade" ? (
        <div
          className={`common ${
            fade ? "fade" : ""
          } bg-teal-950 justify-center text-white fixed bottom-0 left-0 z-[200] w-[100vw] ${
            open
              ? "opacity-95 pointer-events-auto p-8"
              : "opacity-0 pointer-events-none p-8"
          }`}
          contentEditable={true}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      ) : (
        <div
          className={`fixed bottom-0 left-0 z-[200] w-[100vw] reveal-base ${
            open
              ? "reveal-open pointer-events-auto"
              : "reveal-closed pointer-events-none"
          }`}
          style={{ overflow: "hidden" }}
        >
          <div
            className="common bg-teal-950 justify-center text-white p-8 h-full"
            contentEditable={true}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}
    </>
  );
}
