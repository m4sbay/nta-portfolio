import Image from "next/image";
import { LinkPreview } from "../LinkPreview";
import { getEntity } from "../../data/entities";
import styles from "./RichMention.module.css";

/** Only explicit content segments become mentions; repeated names stay plain text. */
export function RichMention({ entity }: { entity: string }) {
  const data = getEntity(entity);
  if (!data) return null;

  return (
    <LinkPreview
      href={data.website}
      preview={data.preview}
      target="_blank"
      rel="noopener noreferrer"
      className={`not-reading group cursor-pointer whitespace-nowrap ${styles.mention}`}
    >
      <span className={`ml-1 mr-1 inline-flex h-4 w-4 items-center justify-center rounded-xs border border-border-subtle dark:border-zinc-200 bg-card dark:bg-zinc-100 align-[-3px] transition-colors group-hover:bg-hover dark:group-hover:bg-zinc-200 ${styles.box}`}>
        <Image
          src={data.logo}
          alt=""
          width={14}
          height={14}
          className="h-3.5 w-3.5 rounded-[4px] object-cover"
        />
      </span>
      <span className={`font-medium transition-colors ${styles.name}`}>
        {data.title}
      </span>
    </LinkPreview>
  );
}
