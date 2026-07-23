"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/shared/status-badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { COMPARE_FIELDS } from "@library/lib/data/compare-fields"
import type { Project } from "@library/types/project"

/**
 * F4 §3.5 — /so-sanh: 4 project columns × 7 core-field rows, sticky label column.
 * Reuses the Local production compare engine (`COMPARE_FIELDS`) so field logic
 * (defensive access, GFA "—" rule, Surbana Jurong visibility, …) is computed
 * in exactly one place — this file only adapts presentation to v0 tokens.
 */
export function CompareTable({ projects }: { projects: Project[] }) {
  const [hideIdentical, setHideIdentical] = useState(false)

  const rows = useMemo(() => {
    return COMPARE_FIELDS.map((field) => ({
      field,
      cells: projects.map((p) => field.cell(p)),
    })).filter((row) => {
      if (!hideIdentical) return true
      const values = row.cells.map((c) => c.display)
      return new Set(values).size > 1
    })
  }, [projects, hideIdentical])

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setHideIdentical((v) => !v)}>
          {hideIdentical ? "Hiện tất cả hàng" : "Ẩn hàng giống nhau"}
        </Button>
      </div>

      {/* Desktop table — accordion takes over below 768px (Tailwind `md`) */}
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="sticky left-0 z-10 bg-muted/40 p-3 text-left font-medium">
                Trường
              </th>
              {projects.map((p) => (
                <th key={p.slug} className="p-3 text-left font-medium">
                  <Link href={`/du-an/${p.slug}`} className="hover:underline">
                    {p.displayNameVi}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.field.id} className="border-b border-border last:border-0">
                <td className="sticky left-0 z-10 bg-background p-3 font-medium">
                  {row.field.label}
                </td>
                {row.cells.map((cell, i) => (
                  <td key={projects[i]?.slug ?? i} className="p-3 align-top">
                    <Tooltip>
                      <TooltipTrigger render={<span className="cursor-help" />}>
                        {cell.display}
                      </TooltipTrigger>
                      <TooltipContent>
                        {cell.tooltip ?? `Cập nhật ${projects[i]?.lastVerifiedAt ?? "—"}`}
                      </TooltipContent>
                    </Tooltip>
                    <div className="mt-1">
                      <StatusBadge status={cell.status} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile (<768px): accordion per project */}
      <Accordion className="md:hidden">
        {projects.map((p) => (
          <AccordionItem key={p.slug} value={p.slug}>
            <AccordionTrigger>{p.displayNameVi}</AccordionTrigger>
            <AccordionContent>
              <dl className="space-y-3">
                {COMPARE_FIELDS.map((field) => {
                  const cell = field.cell(p)
                  return (
                    <div key={field.id}>
                      <dt className="text-xs text-muted-foreground">{field.label}</dt>
                      <dd className="flex items-center gap-2 text-sm">
                        {cell.display}
                        <StatusBadge status={cell.status} />
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
