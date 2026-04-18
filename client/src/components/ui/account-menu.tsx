import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronUp, User2 } from 'lucide-react'
import { SidebarMenuButton } from './sidebar'
import { Link } from '@tanstack/react-router'

export function AccountMenu() {
  const username = ''

  if (username === '') {
    return (
      <Link to={'/'} className={'cursor-pointer'}>
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
          <img
            className="rounded-full"
            src={'/'}
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
          <Link to={'/account'}>Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={'/settings'}>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
