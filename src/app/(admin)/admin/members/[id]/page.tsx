"use client";

import { useUserDetails } from "@/hooks/useUserList";
import { useParams } from "next/navigation";
import { format } from "date-fns";

export default function MemberPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: user, isLoading } = useUserDetails(id);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4 text-red-600">User not found</div>;

  return (
    <div className="  rounded-xl  space-y-4 ">
      <h2 className="text-2xl font-semibold  pb-2 mb-4">Member Details</h2>
      <input type="image" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Detail label="Name" value={user.name} />
        <Detail label="Gender" value={user.gender} />
        <Detail label="Phone" value={user.phone.toString()} />
        <Detail label="Age" value={user.age.toString()} />
        <Detail label="Height" value={`${user.height} cm`} />
        <Detail label="Weight" value={`${user.weight} kg`} />
        <Detail
          label="Status"
          value={capitalize(user.status)}
          status={user.status}
        />
        <Detail label="Active Plan ID" value={user.activePlanId} />
        <Detail
          label="Joining Date"
          value={format(new Date(user.joiningDate), "dd MMM yyyy")}
        />
        <Detail
          label="Payment Start"
          value={format(new Date(user.paymentStart), "dd MMM yyyy")}
        />
        <Detail
          label="Due Date"
          value={format(new Date(user.dueDate), "dd MMM yyyy")}
        />
        <Detail
          label="Created At"
          value={format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
        />
        <Detail
          label="Updated At"
          value={format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm")}
        />
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  const color =
    status === "active"
      ? "text-green-600"
      : status === "inactive"
      ? "text-red-600"
      : "text-gray-800";

  return (
    <div className="flex justify-between  py-2">
      <span className="font-medium ">{label}</span>
      <span className={status ? `${color} font-semibold` : ""}>{value}</span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
