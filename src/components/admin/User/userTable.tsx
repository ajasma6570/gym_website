"use client";

import React, { useContext, useState, useCallback, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import modalContext from "@/context/ModalContext";
import Link from "next/link";
import { Member } from "@/types";
import { memberHasBothFuturePlans } from "@/lib/utils";

type User = Member;

export default function Page({
  data,
  isLoading,
  isSuccess,
  isPending,
}: {
  data: User[];
  isLoading: boolean;
  isSuccess: boolean;
  isPending: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const { setUserFormModal, setDeleteConfirmModal, setPaymentFormModal } =
    useContext(modalContext);

  const handleDeleteUser = useCallback(
    (userId: number, userName: string) => {
      setDeleteConfirmModal({
        isOpen: true,
        userId,
        userName,
      });
    },
    [setDeleteConfirmModal]
  );

  const handlePayNow = useCallback(
    (user: User) => {
      setPaymentFormModal({
        isOpen: true,
        memberData: user,
      });
    },
    [setPaymentFormModal]
  );

  // Function to check if user has an active plan
  const checkUserStatus = useCallback(
    (user: Member): "active" | "inactive" | "expired" => {
      // If user has no active plan, return inactive
      if (!user.activePlan || !user.activePlan.dueDate) {
        return "inactive";
      }

      // Check if the plan is expired
      const dueDate = new Date(user.activePlan.dueDate);
      const now = new Date();

      // Set time to start of day for accurate comparison
      dueDate.setHours(23, 59, 59, 999); // End of due date
      now.setHours(0, 0, 0, 0); // Start of current day

      return dueDate >= now ? "active" : "expired";
    },
    []
  );

  // Memoize the table data to prevent infinite re-renders
  const tableData = useMemo(() => {
    return isSuccess && data ? data : [];
  }, [data, isSuccess]);

  const columns: ColumnDef<User>[] = [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            className="!pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            className="!pl-0"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        const status = checkUserStatus(user);

        const getColor = () => {
          switch (status.toLowerCase()) {
            case "active":
              return "text-green-600";
            case "inactive":
              return "text-gray-500";
            case "expired":
              return "text-red-600";
            default:
              return "text-gray-500";
          }
        };

        const capitalize = (str: string) =>
          str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        return (
          <div className={`${getColor()} font-semibold`}>
            {capitalize(status)}
          </div>
        );
      },
    },

    {
      accessorKey: "activePlan",
      header: "Active Plan",
      cell: ({ row }) => {
        const user = row.original;
        const activePlan = user.activePlan;

        if (!activePlan || !activePlan.plan) {
          return <div className="text-gray-500">No active plan</div>;
        }

        return <div className="capitalize">{activePlan.plan.name}</div>;
      },
    },

    {
      id: "expiryStatus",
      header: "Plan Status",
      cell: ({ row }) => {
        const user = row.original;
        const activePlan = user.activePlan;

        if (!activePlan || !activePlan.dueDate) {
          return <div className="text-gray-500">No plan</div>;
        }

        const dueDate = new Date(activePlan.dueDate);
        const now = new Date();

        // Calculate days difference
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let colorClass = "";
        let message = "";

        if (daysDiff < 0) {
          colorClass = "text-red-600";
          message = `Expired ${Math.abs(daysDiff)} days ago`;
        } else if (daysDiff === 0) {
          colorClass = "text-orange-500";
          message = "Expires today";
        } else if (daysDiff <= 7) {
          colorClass = "text-orange-500";
          message = `Expires in ${daysDiff} day${daysDiff === 1 ? "" : "s"}`;
        } else {
          colorClass = "text-green-600";
          message = `Valid for ${daysDiff} days`;
        }

        return (
          <div className={`${colorClass} font-medium text-sm`}>
            {message}
            <div className="text-sm text-neutral-500 mt-1">
              Due: {format(dueDate, "dd-MM-yyyy")}
            </div>
          </div>
        );
      },
    },

    {
      id: "personalTraining",
      header: "Personal Training",
      cell: ({ row }) => {
        const user = row.original;

        // Check if user has any personal training plans in their history
        const personalTrainingPlan = user.planHistories?.find(
          (planHistory) => planHistory.plan?.type === "personal_training"
        );

        if (!personalTrainingPlan) {
          return <div className="text-gray-500">No PT plan</div>;
        }

        const dueDate = new Date(personalTrainingPlan.dueDate);
        const now = new Date();

        // Calculate days difference
        const timeDiff = dueDate.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let colorClass = "";
        let message = "";

        if (daysDiff < 0) {
          colorClass = "text-red-600";
          message = `Expired ${Math.abs(daysDiff)} days ago`;
        } else if (daysDiff === 0) {
          colorClass = "text-orange-500";
          message = "Expires today";
        } else if (daysDiff <= 7) {
          colorClass = "text-orange-500";
          message = `Expires in ${daysDiff} day${daysDiff === 1 ? "" : "s"}`;
        } else {
          colorClass = "text-green-600";
          message = `Valid for ${daysDiff} days`;
        }

        return (
          <div className={`${colorClass} font-medium text-sm`}>
            <div className="capitalize text-xs text-neutral-600 mb-1">
              {personalTrainingPlan.plan?.name}
            </div>
            {message}
            <div className="text-sm text-neutral-500 mt-1">
              Due: {format(dueDate, "dd-MM-yyyy")}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "details",
      header: "Details",
      cell: ({ row }) => (
        <Link
          className="text-blue-500 hover:text-blue-700 cursor-pointer"
          href={`/admin/members/${row.original.id}`}
        >
          View
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {!memberHasBothFuturePlans(user) && (
                <DropdownMenuItem
                  onClick={() => handlePayNow(user)}
                  className="cursor-pointer "
                >
                  Pay Now
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() =>
                  setUserFormModal({
                    isOpen: true,
                    mode: "edit",
                    userData: user,
                  })
                }
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  user.id !== undefined && handleDeleteUser(user.id, user.name)
                }
                className=" cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, value) => {
      const name = String(row.getValue("name")).toLowerCase().trim();
      const phone = String(row.getValue("phone")).toLowerCase().trim();
      const searchValue = value.toLowerCase().trim();

      // Skip search if searchValue is empty after trimming
      if (!searchValue) return true;

      // For name search, also check without spaces to handle cases like "ajasma" matching "Ajas M A"
      const nameWithoutSpaces = name.replace(/\s+/g, "");
      const searchWithoutSpaces = searchValue.replace(/\s+/g, "");

      return (
        name.includes(searchValue) ||
        nameWithoutSpaces.includes(searchWithoutSpaces) ||
        phone.includes(searchValue)
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center flex-col gap-4 lg:flex-row py-4">
        <Input
          placeholder="Search by name or phone..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full lg:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full lg:max-w-[150px] lg:ml-auto"
            >
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && isPending ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading users...
                  </p>
                </TableCell>
              </TableRow>
            ) : isSuccess && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
