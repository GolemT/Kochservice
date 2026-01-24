import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TagResponse } from '@/api/kochservice.schemas'

export default function RecipeListItem(props: {
  title: string
  imageURL: string
  tags: TagResponse[]
}) {
  return (
    <>
      <li
        className={
          'w-full h-24 flex flex-row justify-between items-center gap-x-4 rounded-2xl border-2 pr-4'
        }
      >
        <Image
          src={props.imageURL}
          alt={props.title}
          className={'h-full w-36 rounded-bl-2xl rounded-tl-2xl'}
          width={150}
          height={100}
        />
        <h2 className={'text-lg text-left flex-1'}>{props.title}</h2>
        <Separator orientation={'vertical'} className={'h-5/6 w-5/6'} />
        <div className={'flex flex-col gap-2 w-48'}>
          {props.tags.map((tag, index: number) => (
            <Badge key={index}>{tag.name}</Badge>
          ))}
        </div>
      </li>
    </>
  )
}
