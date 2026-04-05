import { AutoLinkPlugin as LexicalAutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";

const URL_MATCHERS = [
  (text: string) => {
    const urlRegex =
      /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
    const match = urlRegex.exec(text);
    if (!match) return null;
    return {
      index: match.index,
      length: match[0].length,
      text: match[0],
      url: match[0].startsWith("http") ? match[0] : `https://${match[0]}`,
    };
  },
];

export default function AutoLinkPlugin() {
  return <LexicalAutoLinkPlugin matchers={URL_MATCHERS} />;
}
