import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { artist } from "./artist";
import { article } from "./article";
import { exhibition } from "./exhibition";
import { teamMember } from "./teamMember";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContent, artist, article, exhibition, teamMember],
};
