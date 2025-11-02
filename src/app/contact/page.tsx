export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "";
  return (
    <div className="p-4 space-y-4">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold">usemevi</div>
        <p className="text-gray-600 text-sm">Moda feminina que combina com você.</p>
      </div>
      <div className="space-y-3">
        <a className="block w-full text-center bg-primary text-white py-3 rounded-xl font-semibold" href={whatsapp ? `https://wa.me/${whatsapp}` : "#"} target="_blank" rel="noreferrer">Falar com atendimento</a>
        {instagram && (
          <a className="block w-full text-center bg-black text-white py-3 rounded-xl font-semibold" href={instagram} target="_blank" rel="noreferrer">Visitar Instagram</a>
        )}
      </div>
    </div>
  );
}
