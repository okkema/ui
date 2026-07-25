import type { Icon } from "./Icon"

export interface Navigation {
  text: string
  icon?: Icon
  href?: string
  external?: boolean
  children?: Navigation[]
}
