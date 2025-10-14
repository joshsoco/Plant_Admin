import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Edit, Check, X } from "lucide-react";

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");

  if (!user) return null;

  const displayName = user.name?.trim() || user.firstName?.trim() || user.email?.split("@")[0] || "Admin";

  const handleSave = () => {
    setIsEditing(false);
    updateUser({
      ...user,      // preserve other user fields
      name: newName // update name
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(user.name || "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Basic Info</DialogTitle>
          <DialogDescription>Your account details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Basic Info Grid */}
          <div className="w-full grid grid-cols-2 gap-y-2 text-sm">
            <span className="font-medium text-muted-foreground flex items-center">
              Username:
            </span>
            <span className="font-semibold flex items-center gap-2">
              {isEditing ? (
                <>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border p-1 rounded text-sm"
                  />
                  <button
                    onClick={handleSave}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  {displayName}
                  <button
                    type="button"
                    className="ml-2 text-muted-foreground hover:text-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </>
              )}
            </span>

            <span className="font-medium text-muted-foreground">Email:</span>
            <span className="font-semibold">{user.email}</span>

            <span className="font-medium text-muted-foreground">Role:</span>
            <span className="font-semibold">{user.role || "Admin"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
