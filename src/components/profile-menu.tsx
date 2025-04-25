// ! Ai written code handle with intensive care

"use client";

import { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";

interface ProfileMenuProps {
  usernames: {
    chesscom: string | null;
    lichess: string | null;
  };
  onUpdateUsername: (
    platform: "chesscom" | "lichess",
    username: string
  ) => void;
  isCollapsed: boolean;
}

export default function ProfileMenu({
  usernames,
  onUpdateUsername,
  isCollapsed,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<
    "chesscom" | "lichess" | null
  >(null);
  const [newUsername, setNewUsername] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setEditingPlatform(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditUsername = (platform: "chesscom" | "lichess") => {
    setEditingPlatform(platform);
    setNewUsername(usernames[platform] || "");
  };

  const handleSaveUsername = () => {
    if (editingPlatform && newUsername.trim()) {
      onUpdateUsername(editingPlatform, newUsername);
      setEditingPlatform(null);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
      >
        <FaUser size={30} />
        {!isCollapsed && "Profile"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
          <div className="p-4">
            <h3 className="text-white font-medium mb-3">Your Accounts</h3>

            <div className="space-y-4">
              {/* Chess.com Account */}
              <div className="border-b border-gray-700 pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-400 font-medium">Chess.com</span>
                  {editingPlatform !== "chesscom" && (
                    <button
                      onClick={() => handleEditUsername("chesscom")}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      {usernames.chesscom ? "Edit" : "Add"}
                    </button>
                  )}
                </div>

                {editingPlatform === "chesscom" ? (
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                      placeholder="Enter Chess.com username"
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="ml-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-300">
                    {usernames.chesscom ? usernames.chesscom : "Not set"}
                  </div>
                )}
              </div>

              {/* Lichess Account */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-400 font-medium">Lichess</span>
                  {editingPlatform !== "lichess" && (
                    <button
                      onClick={() => handleEditUsername("lichess")}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      {usernames.lichess ? "Edit" : "Add"}
                    </button>
                  )}
                </div>

                {editingPlatform === "lichess" ? (
                  <div className="flex items-center mt-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md text-white text-sm"
                      placeholder="Enter Lichess username"
                    />
                    <button
                      onClick={handleSaveUsername}
                      className="ml-2 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-300">
                    {usernames.lichess ? usernames.lichess : "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
