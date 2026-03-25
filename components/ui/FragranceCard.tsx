import Image from "next/image";
import NavyCard from "@/components/ui/NavyCard";

interface FragranceCardProps {
  name: string;
  description: string;
  notes: string;
  gradient: string;
  image: string;
}

export default function FragranceCard({
  name,
  description,
  notes,
  gradient,
  image,
}: FragranceCardProps) {
  return (
    <NavyCard className="overflow-hidden group cursor-pointer">
      {/* Product image */}
      <div
        className={`aspect-[3/4] bg-gradient-to-br ${gradient} overflow-hidden relative transition-transform duration-500 group-hover:scale-[1.02]`}
      >
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent">
          <span className="text-xs tracking-widest uppercase text-white/80 font-medium">
            {notes}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="font-serif text-xl text-white">{name}</h3>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          {description}
        </p>
      </div>
    </NavyCard>
  );
}
