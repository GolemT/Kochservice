import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search } from 'lucide-react'

export function HomeLoading() {
  const search = () => {}

  return (
    <div className={'flex flex-col p-4 justify-center items-center gap-8'}>
      <div className="flex flex-row items-center rounded-lg shadow-md md:max-w-[550px] gap-4">
        <Search />
        <Input placeholder="Type a name or ingredient" onSubmit={search} />
      </div>

      <div className={'grid lg:grid-cols-5 gap-6'}>
        {Array.from({ length: 12 }).map((_, index) => (
          <LoadingRecipe key={index} />
        ))}
      </div>
    </div>
  )
}

function LoadingRecipe() {
  return (
    <Card className={'w-fit h-fit'}>
      <CardHeader>
        <CardTitle>
          <div className="space-y-2">
            <Skeleton className="h-2 w-[200px]" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className={'w-48 h-48 rounded-4xl'} />
      </CardContent>
      <CardFooter>
        <div className="space-y-2">
          <Skeleton className="h-2 w-[200px]" />
          <Skeleton className="h-2 w-[150px]" />
        </div>
      </CardFooter>
    </Card>
  )
}
