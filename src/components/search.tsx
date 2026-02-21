import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const search = () => {}

  return (
    <>
      <div className="flex flex-row items-center rounded-lg shadow-md md:max-w-[550px] gap-4">
        <Search />
        <Input placeholder="Type a name or ingredient" onSubmit={search} />
      </div>
    </>
  )
}
