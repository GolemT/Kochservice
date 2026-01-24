'use client'

import { useUserStore } from '@/hooks/user-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/lib/auth/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ChevronUp, User2 } from 'lucide-react'
import { SidebarMenuButton } from './sidebar'
import Link from 'next/link'
import Image from 'next/image'

export default function AccountMenu() {
  const username = useUserStore((state: any) => state.username)
  const profileURL = useUserStore((state: any) => state.profileURL)
  const reset = useUserStore((state: any) => state.reset)
  const router = useRouter()

  async function logoutAction() {
    try {
      const res = await logout()
      console.log(res)
      if (res.success === true) {
        console.log('Logout war erfolgreich')
        reset()
        router.push('/')
        toast.success('Du wurdest erfolgreich abgemeldet')
      }
    } catch (e) {
      toast.error('Beim Abmelden gab es einen Fehler', {
        description: String(e),
      })
    }
  }

  if (username === '') {
    return (
      <Link href={'/auth'} className={'cursor-pointer'}>
        <SidebarMenuButton>
          <User2 />
          Login
        </SidebarMenuButton>
      </Link>
    )
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <Image
            className="rounded-full"
            src={profileURL}
            alt={'Profile Picture'}
            height={17}
            width={17}
          />
          {username}
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem asChild>
          <Link href={'/account'}>Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={'/settings'}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault()
              logoutAction()
            }}
          >
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
