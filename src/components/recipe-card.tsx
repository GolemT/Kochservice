import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { TagResponse } from '@/api/kochservice.schemas'

export default function RecipeCard(props: {
  title: string
  imageURL: string
  tags: TagResponse[]
}) {
  return (
    <Card className={'w-72 h-64'}>
      <CardContent>
        <Image
          src={props.imageURL}
          alt={props.title}
          className={'object-cover w-72 h-36 rounded-lg'}
          width={288}
          height={192}
        />
      </CardContent>
      <CardFooter>
        <CardTitle>{props.title}</CardTitle>
      </CardFooter>
    </Card>
  )
}
