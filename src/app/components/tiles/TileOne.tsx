type Props = { html: string };

export default function TileOne({ html }: Props) {
  return (
    <div
      className="common bg-white fixed left-0 top-0 w-[60vw] h-screen :bg-neutral-800"
      contentEditable={true}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
}
