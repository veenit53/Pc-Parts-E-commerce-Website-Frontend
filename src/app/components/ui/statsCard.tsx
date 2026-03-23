export function StatsCard({ title, value }: any) {

  return (

    <div className="bg-[#111827] p-6 rounded-xl border border-white/10">

      <h3 className="text-gray-400 text-sm">
        {title}
      </h3>

      <p className="text-2xl text-white font-bold mt-2">
        {value}
      </p>

    </div>

  )

}