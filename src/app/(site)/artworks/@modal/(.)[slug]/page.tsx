import { notFound } from "next/navigation";
import { ModalShell } from "@/components/artworks/modal-shell";
import { ArtworkDetail } from "@/components/artworks/artwork-detail";
import { getArtworkBySlug } from "@/lib/artworks";

export default async function ArtworkModal({
  params,
}: {
  params: { slug: string };
}) {
  const artwork = await getArtworkBySlug(params.slug);
  if (!artwork) notFound();

  return (
    <ModalShell>
      <ArtworkDetail artwork={artwork} />
    </ModalShell>
  );
}
