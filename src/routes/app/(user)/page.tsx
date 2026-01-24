import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/public/icon.png'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  return (
    <>
      <div
        className={
          'flex flex-col w-full h-fit lg:h-full items-center justify-center lg:justify-between py-4 lg:pt-4'
        }
      >
        <h1 className={'text-2xl lg:text-4xl font-bold'}>
          {' '}
          GolemT&apos;s Kochservice
        </h1>
        <p className={''}>Built using Next.js</p>
        <div className={'flex flex-col lg:flex-row lg:space-x-12 mt-12'}>
          <Link href={'/recipe/8a8baf5e-7b4b-11ec-90d6-0242ac120004'}>
            <Card>
              <CardContent>
                <Image
                  src="https://images.golemt.org/recipes/Zebrakuchen.webp"
                  alt="Picture of a Cake"
                  className={'h-48 w-72'}
                  width={300}
                  height={200}
                />
              </CardContent>
              <CardFooter>
                <CardTitle>Zebrakuchen</CardTitle>
              </CardFooter>
            </Card>
          </Link>
          <Link href={'/recipe/5a5baf5e-7b4b-11ec-90d6-0242ac120005'}>
            <Card>
              <CardContent>
                <Image
                  src="https://images.golemt.org/recipes/Tiramisu.webp"
                  alt="Picture of Tiramisu"
                  className={'h-48 w-72'}
                  width={300}
                  height={200}
                />
              </CardContent>
              <CardFooter>
                <CardTitle>Tiramisu</CardTitle>
              </CardFooter>
            </Card>
          </Link>
          <Link href={'/recipe/2a2baf5e-7b4b-11ec-90d6-0242ac120002'}>
            <Card>
              <CardContent>
                <Image
                  src="https://images.golemt.org/recipes/koreanfriedchicken.webp"
                  alt="Picture of Chicken Korean style"
                  className={'h-48 w-72'}
                  width={300}
                  height={200}
                />
              </CardContent>
              <CardFooter>
                <CardTitle>Fried Chicken</CardTitle>
              </CardFooter>
            </Card>
          </Link>
        </div>

        <footer
          className={
            'flex flex-col lg:flex-row items-start lg:items-center justify-center bg-sidebar lg:h-48 mt-12 lg:mt-0 w-full p-4 gap-4 lg:space-x-36'
          }
        >
          <Link
            href={'https://gitlab.com/GolemT/'}
            className={'flex flex-col items-center justify-center'}
          >
            <Image
              src={Icon}
              height={100}
              width={100}
              alt={'Profile Picture of the Developer'}
              className={'rounded-2xl'}
            />
            <h2 className={'text-2xl font-semibold'}>GolemT</h2>
          </Link>
          <Separator orientation={'vertical'} />
          <Link href={'https://kochservicedocs.golemt.org/'}>
            <h2 className={'font-semibold text-xl'}>
              Want to host your own Kochservice?
            </h2>
            <p>Take a look at the docs 👀 </p>
          </Link>
          <Separator orientation={'vertical'} />
          <Link href={'https://gitlab.com/GolemT-Development/kochservice'}>
            <h2 className={'font-semibold text-xl'}>Missing a feature?</h2>
            <p>Open an Issue on Gitlab </p>
          </Link>
        </footer>
      </div>
    </>
  )
}
