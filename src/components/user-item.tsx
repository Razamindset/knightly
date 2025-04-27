"use client";

import { UserData } from "@/types/api";
import { User } from "lucide-react";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";



export default function UserItem({
  username,
  rating,
  flag,
  avatar,
}: UserData) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-md`}>
      <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center">
        {avatar ? (
          <Image
            src={avatar}
            alt={`${username}'s avatar`}
            fill
            className="object-cover"
          />
        ) : (
          <User className="h-6 w-6 text-gray-500" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-bold">{username}</span>
          {flag && <ReactCountryFlag countryCode={flag} />}
          <span className="text-sm opacity-80">{rating}</span>
        </div>
      </div>
    </div>
  );
}
