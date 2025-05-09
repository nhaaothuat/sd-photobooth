import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";


import Image from "next/image";
import { Frame } from "@/types/type";
import DeletePayment from "@/components/component/DeletePayment";

import ViewDetailFrame from "@/components/component/IDFrame";
import UpdateFrame from "@/components/component/GPFrame";
import { Group } from "@mantine/core";

const DateCell = ({ value }: { value: string }) => {
  const date = new Date(value);
  return <div>{date.toLocaleDateString()}</div>;
};

export const columns = (
  onDelete: (id: number) => Promise<void>,
  refetchData: () => void
): ColumnDef<Frame>[] => [
    {
      accessorKey: "id",
      header: () => <div className="text-center">ID</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "frameStyleName",
      header: () => <div className="text-center">Style</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("frameStyleName")}</div>,
    },
    {
      accessorKey: "slotCount",
      header: () => <div className="text-center">Slots</div>,
      cell: ({ row }) => <div className="text-center">{row.getValue("slotCount")}</div>,
    },
    {
      accessorKey: "frameUrl",
      header: () => <div className="text-center">Preview</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Image
            src={row.getValue("frameUrl")}
            alt="Frame"
            width={80}
            height={80}
            className="rounded-md object-contain inline-block"
          />
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <DateCell value={row.getValue("createdAt")} />
        </div>
      ),
    },

    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <Group justify="center" gap={"xs"}>
            <UpdateFrame id={id} onUpdated={refetchData} />
            <DeletePayment id={id} onDelete={onDelete} />
            <ViewDetailFrame id={id} />
          </Group>
        )
      },
    },

  ];
