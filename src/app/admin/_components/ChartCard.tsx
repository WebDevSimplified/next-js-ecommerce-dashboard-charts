"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RANGE_OPTIONS } from "@/lib/rangeOptions"
import { subDays } from "date-fns"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ReactNode, useState } from "react"
import { DateRange } from "react-day-picker"
import { date } from "zod"

type ChartCardProps = {
  title: string
  queryKey: string
  selectedRangeLabel: string
  children: ReactNode
}

export function ChartCard({
  title,
  children,
  queryKey,
  selectedRangeLabel,
}: ChartCardProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  })

  function setRange(range: keyof typeof RANGE_OPTIONS | DateRange) {
    const params = new URLSearchParams(searchParams)
    if (typeof range === "string") {
      params.set(queryKey, range)
      params.delete(`${queryKey}From`)
      params.delete(`${queryKey}To`)
    } else {
      if (range.from == null || range.to == null) return
      params.delete(queryKey)
      params.set(`${queryKey}From`, range.from.toISOString())
      params.set(`${queryKey}To`, range.to.toISOString())
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-4 justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{selectedRangeLabel}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(RANGE_OPTIONS).map(([key, value]) => (
                <DropdownMenuItem
                  onClick={() => setRange(key as keyof typeof RANGE_OPTIONS)}
                  key={key}
                >
                  {value.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Custom</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <div>
                    <Calendar
                      mode="range"
                      disabled={{ after: new Date() }}
                      selected={dateRange}
                      defaultMonth={dateRange?.from}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                    <DropdownMenuItem className="hover:bg-auto">
                      <Button
                        onClick={() => {
                          if (dateRange == null) return
                          setRange(dateRange)
                        }}
                        disabled={dateRange == null}
                        className="w-full"
                      >
                        Submit
                      </Button>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
