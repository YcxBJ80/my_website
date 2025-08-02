'use client'

import {
  Bank,
  GithubLogo,
  XLogo,
  InstagramLogo,
  Envelope,
  GraduationCap,
  Coffee,
  Butterfly,
  Pill,
  WechatLogo,
  DiscordLogo,
  LinkedinLogo,
  Television,
  TiktokLogo,
} from '@phosphor-icons/react'

export function CustomIcon({
  name,
  size = 20,
}: {
  name: string
  size?: number
}) {
  switch (name) {
    case 'bank':
      return <Bank size={size} weight="fill" />
    case 'github':
      return <GithubLogo size={size} weight="fill" />
    case 'x':
      return <XLogo size={size} weight="fill" />
    case 'instagram':
      return <InstagramLogo size={size} weight="fill" />
    case 'bsky':
      return <Butterfly size={size} weight="fill" />
    case 'email':
      return <Envelope size={size} weight="fill" />
    case 'college':
      return <GraduationCap size={size} weight="fill" />
    case 'coffee':
      return <Coffee size={size} weight="fill" />
    case 'pill':
      return <Pill size={size} weight="fill" />
    case 'wechat':
      return <WechatLogo size={size} weight="fill" />
    case 'discord':
      return <DiscordLogo size={size} weight="fill" />
    case 'linkedin':
      return <LinkedinLogo size={size} weight="fill" />
    case 'tiktok':
      return <TiktokLogo size={size} weight="fill" />
    case 'bilibili':
      return <Television size={size} weight="fill" />
    default:
      return null
  }
}
