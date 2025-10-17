import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Edit } from "lucide-react";

export function ProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Basic Info</DialogTitle>
          <DialogDescription>Your account details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.firstName?.charAt(0)}
              {user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Basic Info Grid */}
  

<div className="w-full grid grid-cols-2 gap-y-2 text-sm">
  {/* Full Name + Edit icon */}
  <span className="font-medium text-muted-foreground flex items-center">
    Full Name:
  </span>
  <span className="font-semibold flex items-center gap-1">
    {user.name}
    <button
      type="button"
      className="ml-10 text-muted-foreground hover:text-primary"
      onClick={() => console.log("Edit name clicked")}
    >
      <Edit className="h-4 w-4" />
    </button>
  </span>

  <span className="font-medium text-muted-foreground">Email:</span>
  <span className="font-semibold">{user.email}</span>

  <span className="font-medium text-muted-foreground">Role:</span>
  <span className="font-semibold">Admin</span>
</div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
