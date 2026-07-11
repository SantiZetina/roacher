const words = ['Landscapes', 'Portraits', 'City studies', 'Prints', 'Commissions', 'Natural light']

export default function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track flex w-max gap-x-10">
        {/* Four copies so the track always overflows the viewport — with only
            two, wide screens ran out of words before the animation wrapped. */}
        {[0, 1, 2, 3].map((group) => (
          <div key={group} className="flex gap-x-10">
            {words.map((word, index) => (
              <span
                key={word}
                className="flex items-center gap-x-10 font-display text-2xl font-light whitespace-nowrap text-ash"
              >
                <span className={index % 2 ? 'italic' : ''}>{word}</span>
                <span className="text-white/20">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
