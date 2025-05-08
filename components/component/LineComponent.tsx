"use client"

import { useEffect, useState } from "react"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import AxiosAPI from "@/configs/axios"
import { Location } from "@/types/type"


const staticTypeOptions = [
  { label: "Day", value: 0 },
  { label: "Month", value: 1 },
  { label: "Quarter", value: 2 },
  { label: "Year", value: 3 },
]

const groupingTypeOptions = [
  { label: "Location", value: 0 },
  { label: "Booth", value: 1 },
]

const generateColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`

export function Component() {
  const [staticType, setStaticType] = useState(1)
  const [groupingType, setGroupingType] = useState(0)
  const [locationId, setLocationId] = useState<number | undefined>(undefined)
  const [locations, setLocations] = useState<Location[]>([])

  const [chartData, setChartData] = useState<any[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})

 
  useEffect(() => {
    AxiosAPI.get<Location[]>("/api/Location")
      .then((res) => {
        const data = res.data || []
        
        setLocations(data)
      })
      .catch((err) => {
        console.error("Failed to fetch locations:", err)
      })
  }, [])

  
  useEffect(() => {
    if (groupingType === 1 && (!locationId || Number.isNaN(locationId))) return

    AxiosAPI.get("/api/Dashboard/statictis-usage-channel", {
      params: {
        StaticType: staticType,
        ChannelGroupingType: groupingType,
        LocationId: groupingType === 1 ? locationId : undefined,
      },
    }).then((res) => {
      const rawData = (res as any).data?.data || []
      const grouped: Record<string, any> = {}
      const config: ChartConfig = {}

      const labelsSet = new Set<string>()
      const namesSet = new Set<string>()

      rawData.forEach((item: any) => {
        let label = null

        if (staticType === 0 && item.day) {
          const date = new Date(item.day)
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, "0")
          const d = String(date.getDate()).padStart(2, "0")
          label = `${y}-${m}-${d}`
        } else if (staticType === 1 && item.year && item.month) {
          label = `${item.year}-${String(item.month).padStart(2, "0")}`
        } else if (staticType === 2 && item.year && item.quarter) {
          label = `Q${item.quarter} ${item.year}`
        } else if (staticType === 3 && item.year) {
          label = `${item.year}`
        }

        if (!label) return

        const name = item.name?.trim() || "Unknown"
        const totalUsage = item.totalUsage || 0
        if (totalUsage === 0) return

        labelsSet.add(label)
        namesSet.add(name)

        if (!grouped[label]) grouped[label] = { month: label }
        grouped[label][name] = (grouped[label][name] || 0) + totalUsage

        if (!config[name]) {
          config[name] = {
            label: name,
            color: generateColor(),
          }
        }
      })

      const allLabels = Array.from(labelsSet)
      const allNames = Array.from(namesSet)

      allLabels.forEach((label) => {
        if (!grouped[label]) grouped[label] = { month: label }
        allNames.forEach((name) => {
          if (grouped[label][name] == null) {
            grouped[label][name] = 0
          }
        })
      })

      const sortedData = allLabels
        .sort((a, b) => {
          if (staticType === 2) return 0
          return new Date(a).getTime() - new Date(b).getTime()
        })
        .map((label) => grouped[label])

      setChartData(sortedData)
      setChartConfig(config)
    })
  }, [staticType, groupingType, locationId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage by Channel</CardTitle>
        <CardDescription>Dynamic view by StaticType and Channel</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <Select value={String(staticType)} onValueChange={(v) => setStaticType(Number(v))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Static Type" />
            </SelectTrigger>
            <SelectContent>
              {staticTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(groupingType)} onValueChange={(v) => setGroupingType(Number(v))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Grouping Type" />
            </SelectTrigger>
            <SelectContent>
              {groupingTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {groupingType === 1 && (
            <Select
              value={locationId?.toString() ?? ""}
              onValueChange={(value) => setLocationId(Number(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={String(loc.id)}>
                    {loc.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <ChartContainer config={chartConfig}>
          <LineChart height={300} data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.length > 6 ? value.slice(0, 7) : value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(chartConfig).map((key) => (
              <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartConfig[key].color}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
