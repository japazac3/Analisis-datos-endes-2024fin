import * as React from "react"

import { cn } from "../../lib/utils"

interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

const SelectTrigger: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => null
SelectTrigger.displayName = "SelectTrigger"

const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => null
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}
const SelectItem: React.FC<SelectItemProps> = () => null
SelectItem.displayName = "SelectItem"

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}
const SelectValue: React.FC<SelectValueProps> = () => null
SelectValue.displayName = "SelectValue"

function collectItems(children: React.ReactNode) {
  const items: Array<{ value: string; label: React.ReactNode }> = []
  let placeholder: string | undefined
  let triggerClassName: string | undefined

  const visit = (node: React.ReactNode) => {
    React.Children.forEach(node, (child) => {
      if (!React.isValidElement(child)) return

      if (child.type === SelectItem) {
        items.push({ value: child.props.value, label: child.props.children })
      }

      if (child.type === SelectValue) {
        placeholder = child.props.placeholder
      }

      if (child.type === SelectTrigger) {
        triggerClassName = child.props.className
      }

      if (child.props?.children) {
        visit(child.props.children)
      }
    })
  }

  visit(children)
  return { items, placeholder, triggerClassName }
}

function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const { items, placeholder, triggerClassName } = collectItems(children)

  return (
    <select
      className={cn(
        "flex h-10 w-full appearance-none rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60",
        triggerClassName
      )}
      value={value}
      defaultValue={defaultValue}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {placeholder ? (
        <option value="" disabled hidden>
          {placeholder}
        </option>
      ) : null}
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
