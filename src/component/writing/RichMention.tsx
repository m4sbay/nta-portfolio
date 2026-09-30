import Image from "next/image";
import { getEntity } from "../../data/entities";
import styles from "./RichMention.module.css";

/** Only explicit content segments become mentions; repeated names stay plain text. */
export function RichMention({ entity }: { entity: string }) {
  const data = getEntity(entity);
  if (!data) return null;

  return (
    <a
      href={data.website}
      target="_blank"
      rel="noopener noreferrer"
      className={`not-reading group cursor-pointer whitespace-nowrap ${styles.mention}`}
    >
      <span className={`mr-1.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-sm border border-zinc-200 bg-white align-[-3px] transition-colors group-hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/10 ${styles.box}`}>
        <Image
          src={data.logo}
          alt=""
          width={14}
          height={14}
          className="h-4 w-4 rounded-[4px] object-cover"
        />
      </span>
      <span className={`text-blue-500 font-medium transition-colors group-hover:text-blue-500 dark:text-blue-400 dark:group-hover:text-blue-400 ${styles.name}`}>
        {data.title}
      </span>
    </a>
  );
}
