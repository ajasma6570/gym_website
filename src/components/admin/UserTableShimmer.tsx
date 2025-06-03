import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function UserTableShimmer() {
  return (
    <>
      <div>
        <Skeleton className="h-9  w-[250px]" />
      </div>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Skeleton className="h-9 w-[250px]" />
          <Skeleton className="ml-auto h-9 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <div className="p-4">
            {/* Table header skeleton */}
            <div className="flex space-x-4 mb-4">
              <Skeleton className="h-4 w-[50px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            {/* Table rows skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex space-x-4 mb-3">
                <Skeleton className="h-4 w-[50px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-4 w-[150px]" />
          <div className="space-x-2 flex">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        </div>
      </div>
    </>
  );
}
