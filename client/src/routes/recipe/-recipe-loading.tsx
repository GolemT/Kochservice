import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export function RecipeLoading() {
  return (
    <>
      {/* Loading for small screens */}
      <div
        className={
          'flex flex-col p-4 justify-center items-center gap-8 lg:hidden'
        }
      >
        <Skeleton className={'h-4 w-4/6'} />
        <Separator />
        <Skeleton className={'h-4 w-3/6'} />
        <ul className="space-y-4 flex flex-col justify-center items-center w-full">
          {[...Array(8)].map((_, i) => (
            <li key={i} className="flex justify-between  w-1/2 h-4">
              <Skeleton className={'h-2 w-2/6'} />
              <Skeleton className={'h-2 w-2/6'} />
            </li>
          ))}
        </ul>
        <Separator />
        <div className={'space-y-4'}>
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
        </div>

        <div className={'space-y-4'}>
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
        </div>

        <div className={'space-y-4'}>
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
          <Skeleton className={'h-2 w-64'} />
        </div>
      </div>

      {/*Loading for large screens */}
      <div className={'hidden lg:flex'}>
        <div
          className={
            'absolute right-3 h-11/12 p-4 rounded-lg transition-all duration-300 w-52 bg-muted'
          }
        >
          <h2 className="text-2xl font-semibold mb-12">Ingredients</h2>
          <ul className="text-left space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="w-full h-4" />
            ))}
          </ul>
        </div>
        <div className={'flex flex-col items-center justify-center gap-16'}>
          <div className={'flex flex-col space-y-4 w-86 h-52'}>
            <Skeleton className={'w-86 h-52'} />
            <Skeleton className={'h-6 w-72'} />
            <Skeleton className={'h-4 w-64'} />
          </div>

          <div className={'space-y-4'}>
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
          </div>

          <div className={'space-y-4'}>
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
          </div>

          <div className={'space-y-4'}>
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
            <Skeleton className={'h-4 w-94'} />
          </div>
        </div>
      </div>
    </>
  )
}
